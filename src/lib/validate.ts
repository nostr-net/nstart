// Pure input-validation helpers used by the /send-email endpoint. Kept free
// of framework imports so they can be unit-tested with `node --test`.

import { decode } from '@nostr/tools/nip19';

const EMAIL_RE =
	/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

// bech32 data charset (everything after the '1' separator), i.e. [0-9a-z] minus '1', 'b', 'i', 'o'
const BECH32_DATA_RE = /^[02-9ac-hj-np-z]+$/;

export function isValidEmail(to: unknown): to is string {
	// must be a single string: no commas, semicolons, whitespace, CR/LF or
	// angle brackets can survive this charset, and neither can extra addresses
	if (typeof to !== 'string') return false;
	if (to.length === 0 || to.length > 254) return false;
	return EMAIL_RE.test(to);
}

export function isValidNcryptsec(ncryptsec: unknown): ncryptsec is string {
	if (typeof ncryptsec !== 'string') return false;
	if (ncryptsec.length >= 500 || ncryptsec.length <= 'ncryptsec1'.length) return false;
	if (!ncryptsec.startsWith('ncryptsec1')) return false;
	return BECH32_DATA_RE.test(ncryptsec.substring('ncryptsec1'.length));
}

/**
 * Decode an `npub`-encoded public key and check it matches the pubkey that
 * signed the authorization event (prevents mailing somebody else's key).
 */
export function npubMatchesPubkey(npub: unknown, pubkey: string): boolean {
	if (typeof npub !== 'string') return false;
	try {
		const decoded = decode(npub);
		return decoded.type === 'npub' && decoded.data === pubkey;
	} catch {
		return false;
	}
}
