import { type NostrEvent, type UnsignedEvent } from '@nostr/tools';
import { SimplePool } from 'nostr-tools/pool'
import { nip19 } from '@nostr/tools';

import HashWorker from './worker?worker';

export const signers = [
	'ad1c6fa1daca939685d34ab541fc9e7b450ef6295aa273addafee74a579d57fb', // sebastix
	'23a3ff76766f5ffc852fa6f2fc5058c1306ee25927632e0f8e213af11a5b8de5', // fiatjaf 2
	// 'aa4f53d8041b88adee44cefb62fb49fdeb85d151d1a346e655850c213508ed2e', // hodlbod
	'0a7c2da051f9f215c4c97f6cdc3dd444e73ea00c10647fa5e552cfc78a506e94', // pablo
	'4be49a6175734b43c7083ceac11e47bf684ffe65bd021c949bea1702409c119a', // daniele
	'17da048b868a247beef98160907b2127030dbc718fea9eb5225913576586cb8c' // fiatjaf 1
];

export const indexRelays = [
	'wss://purplepag.es',
	'wss://user.kindpag.es',
	'wss://relay.nostr.band',
	'wss://relay.nos.social',
	'wss://relay.damus.io'
];

export async function minePow(
	unsigned: UnsignedEvent,
	difficulty: number,
	onBetterHash: (pow: number) => void
): Promise<Omit<NostrEvent, 'sig'>> {
	const workers: Worker[] = [];
	const nWorkers = 4;
	let best = 0;
	return new Promise((resolve) => {
		for (let i = 0; i < nWorkers; i++) {
			const worker = new HashWorker();
			workers.push(worker);
			worker.postMessage({ evt: unsigned, difficulty, start: i, step: nWorkers });
			worker.onmessage = (ev) => {
				const { pow, evt } = ev.data;
				if (pow) {
					if (pow > best) {
						onBetterHash(pow > difficulty ? difficulty : pow);
						best = pow;
					}
				} else {
					resolve(evt);
					workers.forEach((w) => w.terminate());
				}
			};
		}
	});
}

export function selectWriteRelays(): string[] {
	const writeRelays = [
		'wss://relay.damus.io',
		'wss://offchain.pub',
		'wss://nostr.mom',
		'wss://nos.lol',
		'wss://nostr.fmt.wiz.biz',
		'wss://relay.mostr.pub',
		'wss://relay.primal.net'
	];

	const urls = [];
	urls.push(pick(writeRelays));
	urls.push(pick(writeRelays));
	urls.push(pick(writeRelays));
	return urls;
}

export function selectReadRelays(): string[] {
	const wotRelays = [
		'wss://wot.utxo.one',
		'wss://nostrelites.org',
		'wss://wot.nostr.party',
		'wss://wot.sandwich.farm'
	];

	const safeRelays = ['wss://pyramid.fiatjaf.com', 'wss://nostr.wine'];

	const urls = [];
	urls.push('wss://nostr.mom');
	urls.push(pick(wotRelays));
	urls.push(pick(wotRelays));
	urls.push(pick(safeRelays));
	return urls;
}

function pick<A>(options: A[]): A {
	const idx = Math.floor(Math.random() * options.length);
	const sel = options[idx];
	options.splice(idx, 1);
	return sel;
}

export async function getProfile(code) {
  let publicKey;
  if (/^(nprofile|npub)/.test(code)) {
    try {
      const { type, data } = nip19.decode(code);
      if (type === 'npub') {
        publicKey = data;
      } else if (type === 'nprofile') {
        publicKey = data.pubkey;
      }
    } catch (error) {
      console.error('Failed to decode npub:', error);
      return null;
    }
  } else if (code.length === 64) {
    publicKey = code;
  } else {
    console.error('Invalid code format');
    return null;
  }

	const pool = new SimplePool()

  return new Promise((resolve, reject) => {
    let subscription = pool.subscribeMany(
      indexRelays,
      [
        {
          kinds: [0],
          authors: [publicKey],
          limit: 1,
        }
      ],
      {
        onevent(event) {
          subscription.close();
          resolve(event);
        },
        onerror(error) {
          console.error(`Subscription error: ${error}`);
          subscription.close();
          reject(error);
        }
      }
    );
  });
}