import { browser } from '$app/environment';
import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';
import { userfrontCookieToTokens } from '$lib/index.js';


// Before every time this route loads, get updated Userfront cookies:
export const load = async () => {
	const userfrontTokens = !browser
		? null
		: await userfrontCookieToTokens(document?.cookie, PUBLIC_USERFRONT_ACCOUNT_ID);

	return { userfrontTokens };
};
