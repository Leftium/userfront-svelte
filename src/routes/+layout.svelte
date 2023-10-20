<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';

	import { userfrontCookieToTokens, verifyToken } from '$lib/index.js';

	import {
		PUBLIC_USERFRONT_ACCOUNT_ID,
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
	} from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	beforeNavigate(async (navigation) => {
		const toPathname = navigation.to?.url.pathname as string;

		const userfrontTokens = await userfrontCookieToTokens(
			document.cookie,
			PUBLIC_USERFRONT_ACCOUNT_ID
		);

		const accessPayload = await verifyToken(
			PUBLIC_USERFRONT_PUBLIC_KEY_BASE64,
			userfrontTokens?.accessToken
		);

		if (!accessPayload && !['/', '/login', '/reset'].includes(toPathname)) {
			goto('/login');
		}
	});
</script>

<center>
	<a href="/">Home</a> |
	<a href="/login">Login</a> |
	<a href="/reset">Reset</a> |
	<a href="/dashboard">Dashboard</a>

	<slot />
</center>
