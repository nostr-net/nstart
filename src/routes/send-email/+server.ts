// src/routes/api/send-email/+server.ts
import nodemailer from 'nodemailer';
import { getPow } from '@nostr/tools/nip13';
import { verifyEvent, type NostrEvent } from '@nostr/tools/pure';
import {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_SECURE,
	SMTP_USER,
	SMTP_PASS,
	SMTP_FROM_NAME,
	VITE_SMTP_FROM_EMAIL
} from '$env/static/private';

export const POST = async ({ request }: { request: Request }) => {
	try {
		const evt = JSON.parse(atob(request.headers.get('Authorization')!.substring(6))) as NostrEvent;

		// check if they have sent enough pow
		if (!verifyEvent(evt)) {
			throw 'invalid authorization event signature';
		}
		if (getPow(evt.id) < 20) {
			throw 'insufficient pow';
		}

		const { to, ncryptsec, npub } = await request.json();

		// Create a transporter object using the nodemailer library
		const transporter = (nodemailer as any).createTransport({
			host: SMTP_HOST!,
			port: SMTP_PORT!,
			secure: SMTP_SECURE === 'yes',
			auth: {
				user: SMTP_USER!,
				pass: SMTP_PASS!
			}
		});

		// Set up email data
		const mail_options = {
			from: `"${SMTP_FROM_NAME}" <${VITE_SMTP_FROM_EMAIL}>`,
			to: to,
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
		};

		// Send email
		const info = await transporter.sendMail(mail_options);

		// Return a Response object
		return new Response(
			JSON.stringify({
				message: 'Email sent successfully',
				messageId: info.messageId
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		console.error(error); // Log the error for debugging
		return new Response(
			JSON.stringify({
				error: 'Internal server error'
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
