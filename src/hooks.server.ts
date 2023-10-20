import { redirect } from '@sveltejs/kit';
import {
	PUBLIC_USERFRONT_ACCOUNT_ID,
	PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
} from '$env/static/public';
import { parseUserfrontCookies } from '$lib/index.js';

export async function handle({ event, resolve }) {
	const { pathname } = event.url;

	const cookies = event.request.headers.get('cookie');

	const userfrontPayloads = await parseUserfrontCookies(
		cookies,
		PUBLIC_USERFRONT_ACCOUNT_ID,
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
	);

	console.log(`handle()`);
	if (!userfrontPayloads?.access && !['/', '/login', '/reset'].includes(pathname)) {
		throw redirect(302, '/login');
	}

	event.locals = { userfrontPayloads };

	return resolve(event);
}
