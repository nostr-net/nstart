import { pk, ncryptsec } from '$lib/store';
import { finalizeEvent, type NostrEvent } from '@nostr/tools/pure';
import * as nip49 from '@nostr/tools/nip49';
import { indexRelays, minePow, pool, selectReadRelays, selectWriteRelays } from './nostr';

export const delayedActions: [(...args: any) => Promise<void>, any[]][] = [];

export async function runActions(): Promise<void> {
	await Promise.all(delayedActions.map(([action, args]) => action(...args)));
}

export async function sendEmail(sk: Uint8Array, npub: string, email: string, password: string) {
	// Restart mining if it has already been used
	if (mining === undefined) {
		pk.subscribe((currentPk) => {
			mineEmail(sk, currentPk);
			// Unsubscribe after getting the value
			return () => {};
		})();
	}

	try {
		let emailNcryptsec = undefined;
		ncryptsec.subscribe((currentNcryptsec) => {
			emailNcryptsec = currentNcryptsec;
			// Unsubscribe after getting the value
			return () => {};
		})();
		if (emailNcryptsec === '') {
			emailNcryptsec = nip49.encrypt(sk, password);
		}
		const response = await fetch('/send-email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Nostr ' + btoa(JSON.stringify(await mining))
			},
			body: JSON.stringify({ to: email, ncryptsec: emailNcryptsec, npub: npub })
		});

		const result = await response.json();
		if (response.ok) {
			console.log('email sent', result.message);
		} else {
			throw result.error;
		}
	} catch (err) {
		console.log('failed to send email', err);
	}
	resetMining();
}

export async function publishRelayList(sk: Uint8Array) {
	const ourInbox: string[] = selectReadRelays();
	const ourOutbox: string[] = selectWriteRelays();

	const tags: string[][] = [];
	for (let i = 0; i < ourOutbox.length; i++) {
		const url = ourOutbox[i];
		tags.push(['r', url, 'write']);
	}
	for (let i = 0; i < ourInbox.length; i++) {
		const url = ourInbox[i];
		tags.push(['r', url, 'read']);
	}

	const signedEvent = finalizeEvent(
		{
			kind: 10002,
			created_at: Math.floor(Date.now() / 1000),
			tags,
			content: ''
		},
		sk
	);
	pool.publish(indexRelays, signedEvent);
	console.log('Published ' + JSON.stringify(signedEvent));
}

export async function publishProfile(sk: Uint8Array, metadata: any) {
	const signedEvent = finalizeEvent(
		{
			kind: 0,
			created_at: Math.floor(Date.now() / 1000),
			tags: [],
			content: JSON.stringify(metadata)
		},
		sk
	);
	pool.publish(indexRelays, signedEvent);
	console.log('Published ' + JSON.stringify(signedEvent));
}

export async function publishFollows(sk: Uint8Array, follows: Promise<string[][]>) {
	const signedEvent = finalizeEvent(
		{
			kind: 3,
			created_at: Math.floor(Date.now() / 1000),
			tags: await follows,
			content: ''
		},
		sk
	);
	pool.publish(indexRelays, signedEvent);
	console.log('Published ' + JSON.stringify(signedEvent));
}

let mining: Promise<NostrEvent> | undefined;

export function resetMining() {
	mining = undefined;
}

export async function mineEmail(sk: Uint8Array, pk: string) {
	mining = minePow(
		{
			pubkey: pk,
			created_at: Math.floor(Date.now() / 1000),
			kind: 20000,
			tags: [],
			content: ''
		},
		20,
		() => {}
	).then((uevt) => finalizeEvent(uevt, sk));
}
