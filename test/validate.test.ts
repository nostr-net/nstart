import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, isValidNcryptsec, npubMatchesPubkey } from '../src/lib/validate.ts';

test('isValidEmail accepts single sane addresses', () => {
	assert.equal(isValidEmail('someone@example.com'), true);
	assert.equal(isValidEmail("o'brien@example.co.uk"), true);
	assert.equal(isValidEmail('a+b+c@sub.domain.org'), true);
});

test('isValidEmail rejects injection attempts and garbage', () => {
	assert.equal(isValidEmail('a@b.com,c@d.com'), false); // comma
	assert.equal(isValidEmail('a@b.com;c@d.com'), false); // semicolon
	assert.equal(isValidEmail('a@b.com\r\nBcc: x@y.com'), false); // CRLF
	assert.equal(isValidEmail('a b@c.com'), false); // whitespace
	assert.equal(isValidEmail('<a@b.com>'), false); // angle brackets
	assert.equal(isValidEmail(''), false);
	assert.equal(isValidEmail(null), false);
	assert.equal(isValidEmail(undefined), false);
	assert.equal(isValidEmail(42), false);
	assert.equal(isValidEmail(['a@b.com']), false);
	// header injection via display name
	assert.equal(isValidEmail('From: x <a@b.com>'), false);
	assert.equal(isValidEmail('a@b.com'.repeat(40)), false); // > 254 chars
	assert.equal(isValidEmail('a@b'), false); // no TLD-ish label
});

test('isValidNcryptsec only accepts bech32 ncryptsec strings', () => {
	assert.equal(isValidNcryptsec('ncryptsec1q3tn523j5kd2n8080t6x0g26fuygu'), true);
	assert.equal(isValidNcryptsec('nsec1anything'), false); // wrong prefix
	assert.equal(isValidNcryptsec('ncryptsec1'), false); // no data
	assert.equal(isValidNcryptsec('ncryptsec1withbadchars1biox'), false); // '1', 'b', 'i', 'o' not allowed after prefix
	assert.equal(isValidNcryptsec('ncryptsec1' + 'z'.repeat(600)), false); // too long
	assert.equal(isValidNcryptsec(null), false);
	assert.equal(isValidNcryptsec(123), false);
});

test('npubMatchesPubkey decodes npub and compares hex', () => {
	const pubkey = '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d';
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkwsyjh6w6';
	assert.equal(npubMatchesPubkey(npub, pubkey), true);
	assert.equal(npubMatchesPubkey(npub, '00'.repeat(32)), false); // wrong key
	assert.equal(npubMatchesPubkey('npub1zzzz', pubkey), false); // undecodable
	assert.equal(npubMatchesPubkey('nsec1q3tn...', pubkey), false); // wrong type
	assert.equal(npubMatchesPubkey(null, pubkey), false);
	assert.equal(npubMatchesPubkey(undefined, pubkey), false);
});
