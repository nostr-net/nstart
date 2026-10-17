import type { Handle } from '@sveltejs/kit/hooks';

const securityHeaders: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	// URLs can carry login tokens in fragments; fragments are not sent by
	// browsers, but stay strict anyway
	'Referrer-Policy': 'no-referrer',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	// the popup login flow relies on window.opener, so same-origin is not an option
	'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
	'Strict-Transport-Security': 'max-age=31536000'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	for (const [name, value] of Object.entries(securityHeaders)) {
		response.headers.set(name, value);
	}
	return response;
};
