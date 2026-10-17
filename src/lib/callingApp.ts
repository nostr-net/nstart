// Validation for the "calling app" URL parameters (`an`, `at`, `ac`) that
// control how the wizard hands the generated login token back to the app
// that opened it. These parameters are attacker-controlled: a malicious
// `ac` such as `javascript:...` used to be able to make the "back to app"
// button execute script on our origin, so everything is strictly validated
// before it is ever used to build a URL.

export type CallingAppType = 'modal' | 'web' | 'popup' | 'android' | 'ios';

const ANDROID_PACKAGE_RE = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;
const IOS_SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]{0,63}$/;
const BLOCKED_IOS_SCHEMES = [
	'javascript',
	'data',
	'vbscript',
	'file',
	'about',
	'blob',
	'http',
	'https'
];

export function isValidCallingAppType(at: string | null | undefined): at is CallingAppType {
	return at === 'modal' || at === 'web' || at === 'popup' || at === 'android' || at === 'ios';
}

export function isValidCallingAppCode(
	at: CallingAppType,
	ac: string | null | undefined
): ac is string {
	if (typeof ac !== 'string' || ac.length === 0) return false;

	switch (at) {
		case 'modal':
			// the code is not used to build any URL in this case
			return true;
		case 'web':
		case 'popup': {
			let url: URL;
			try {
				url = new URL(ac);
			} catch {
				return false;
			}
			if (url.protocol === 'https:') return true;
			if (url.protocol === 'http:') {
				// plain http is only acceptable for local development
				return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
			}
			return false;
		}
		case 'android':
			// must be a valid android package name, e.g. com.example.app
			return ANDROID_PACKAGE_RE.test(ac);
		case 'ios':
			// must be a safe custom URL scheme
			return IOS_SCHEME_RE.test(ac) && !BLOCKED_IOS_SCHEMES.includes(ac.toLowerCase());
	}
}

/**
 * Validate the triple of calling-app parameters. Returns the validated
 * values, or `null` if anything is invalid or missing (in which case all
 * three must be reset by the caller).
 */
export function validateCallingAppParams(
	an: string | null,
	at: string | null,
	ac: string | null
): { name: string; type: CallingAppType; code: string } | null {
	if (typeof an !== 'string' || an.length === 0) return null;
	if (!isValidCallingAppType(at)) return null;
	if (!isValidCallingAppCode(at, ac)) return null;
	return { name: an, type: at, code: ac as string };
}

/**
 * Hostname of the destination for web/popup redirects, so it can be shown
 * to the user before they are sent there. Returns null when unknown.
 */
export function callingAppHost(at: CallingAppType, ac: string): string | null {
	if (at !== 'web' && at !== 'popup') return null;
	try {
		return new URL(ac).hostname;
	} catch {
		return null;
	}
}
