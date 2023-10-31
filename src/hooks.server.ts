import { redirect } from '@sveltejs/kit';
import {
	PUBLIC_USERFRONT_ACCOUNT_ID,
	PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
} from '$env/static/public';

import { userfrontCookieToTokens, verifyToken } from '$lib/index.js';

export async function handle({ event, resolve }) {
	const { pathname } = event.url;

	const cookie = event.request.headers.get('cookie');

	const userfrontTokens = await userfrontCookieToTokens(cookie, PUBLIC_USERFRONT_ACCOUNT_ID);

	const accessPayload = await verifyToken(
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64,
		userfrontTokens?.accessToken
	);

	if (!accessPayload && !['/', '/signup', '/login', '/reset'].includes(pathname)) {
		throw redirect(302, '/login');
	}

	return resolve(event);
}
