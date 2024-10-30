import { get } from 'svelte/store';
import { finalizeEvent } from 'nostr-tools/pure';
import { sk, name, picture, about, website, published } from '$lib/store';
import { pool, indexRelays } from '$lib/nostr';

export async function publishProfile() {
	let eventTemplate: EventTemplate = {
		kind: 0,
		created_at: Math.floor(Date.now() / 1000),
		tags: [],
		content: `{"name": "${get(name)}", "picture": "${get(picture)}", "about": "${get(about)}", "website": "${get(website)}"}`
	};
	let signedEvent = finalizeEvent(eventTemplate, get(sk));
	pool.publish(indexRelays, signedEvent);
  console.log("Published " + JSON.stringify(signedEvent))
	published.set(true);
}
