import {
	PUBLIC_USERFRONT_ACCOUNT_ID,
	PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
} from '$env/static/public';

import { userfrontCookieToTokens, verifyToken } from '$lib/index.js';

export async function handle({ event, resolve }) {
	const cookie = event.request.headers.get('cookie');
	const userfrontTokens = await userfrontCookieToTokens(cookie, PUBLIC_USERFRONT_ACCOUNT_ID);

	// Add user auth info from UserFront JWT to SvelteKit request event.
	// Reference:
	// - https://github.com/sveltejs/realworld/blob/0e44badcc994adb277cd6ac274c126b89a91df8c/src/hooks.server.js#L4
	// - https://userfront.com/examples/vue#vue-authentication-with-an-api
	event.locals.auth = event.locals.auth = await verifyToken(
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64,
		userfrontTokens?.accessToken
	);

	return resolve(event);
}
