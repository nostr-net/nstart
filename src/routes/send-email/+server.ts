// src/routes/send-email/+server.ts
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { getPow } from '@nostr/tools/nip13';
import { verifyEvent, type NostrEvent } from '@nostr/tools/pure';
import { env } from '$env/dynamic/private';
import { isValidEmail, isValidNcryptsec, npubMatchesPubkey } from '#lib/validate';
import { json } from '@sveltejs/kit';

const REPLAY_TTL_MS = 15 * 60 * 1000; // auth events older than this are forgotten
const REPLAY_MAX_ENTRIES = 10_000;

/** event ids of already-used authorization events -> expiry timestamp */
const usedEventIds = new Map<string, number>();

/** @returns true if this event id was not used before (and is now marked as used) */
function checkAndMarkEventId(id: string): boolean {
	const now = Date.now();

	// opportunistic cleanup of expired entries
	if (usedEventIds.size >= REPLAY_MAX_ENTRIES) {
		for (const [usedId, expiry] of usedEventIds) {
			if (expiry <= now) usedEventIds.delete(usedId);
		}
		// still full (many unique events within the TTL): drop the oldest
		while (usedEventIds.size >= REPLAY_MAX_ENTRIES) {
			const oldest = usedEventIds.keys().next();
			if (oldest.done) break;
			usedEventIds.delete(oldest.value);
		}
	}

	if (usedEventIds.has(id)) return false;

	usedEventIds.set(id, now + REPLAY_TTL_MS);
	return true;
}

/** lazily created and cached SMTP transporter (module level) */
let transporter: Transporter | undefined;

function getTransporter(): Transporter {
	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: env.SMTP_HOST,
			port: env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined,
			secure: env.SMTP_SECURE === 'yes',
			auth: {
				user: env.SMTP_USER,
				pass: env.SMTP_PASS
			}
		});
	}
	return transporter;
}

function badRequest() {
	return json({ error: 'Bad request' }, { status: 400 });
}

export const POST = async ({ request }: { request: Request }) => {
	// --- validate the authorization header ---------------------------------
	const authorization = request.headers.get('Authorization');
	if (!authorization || !authorization.startsWith('Nostr ')) {
		return badRequest();
	}

	let evt: NostrEvent;
	try {
		evt = JSON.parse(atob(authorization.substring(6))) as NostrEvent;
	} catch {
		return badRequest();
	}

	if (
		typeof evt !== 'object' ||
		evt === null ||
		evt.kind !== 20000 ||
		typeof evt.created_at !== 'number' ||
		Math.abs(Math.floor(Date.now() / 1000) - evt.created_at) > 600 ||
		!verifyEvent(evt) ||
		getPow(evt.id) < 20
	) {
		return badRequest();
	}

	if (!checkAndMarkEventId(evt.id)) {
		return json({ error: 'Too many requests' }, { status: 429 });
	}

	// --- validate the body ---------------------------------------------------
	let body: { to?: unknown; ncryptsec?: unknown; npub?: unknown };
	try {
		body = await request.json();
	} catch {
		return badRequest();
	}

	if (
		!isValidEmail(body.to) ||
		!isValidNcryptsec(body.ncryptsec) ||
		!npubMatchesPubkey(body.npub, evt.pubkey)
	) {
		return badRequest();
	}

	const to = body.to;
	const ncryptsec = body.ncryptsec;
	const npub = body.npub;

	// --- send the email -------------------------------------------------------
	try {
		const info = await getTransporter().sendMail({
			from: `"${env.SMTP_FROM_NAME ?? ''}" <${env.VITE_SMTP_FROM_EMAIL}>`,
			to,
			subject: 'Your Nostr account',
			text: `Hello!

This is your Nostr npub:
${npub}

And this is your encrypted Nostr key:
${ncryptsec}

Remember to save the chosen password in a safe place!

Welcome to Nostr :)

PS: This email address does not accept replies, to request support please tag https://njump.me/dtonon.com or https://njump.me/fiatjaf.com on Nostr
`
		});

		return json({ message: 'Email sent successfully', messageId: info.messageId });
	} catch (err) {
		// log only the error itself, never the request body (it contains the ncryptsec)
		console.error('failed to send email:', err instanceof Error ? err.message : err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
