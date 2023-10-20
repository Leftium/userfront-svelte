<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { parseUserfrontCookies } from '$lib';

	import {
		PUBLIC_USERFRONT_ACCOUNT_ID,
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
	} from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	beforeNavigate(async () => {
		const userfrontPayloads = await parseUserfrontCookies(
			document.cookie,
			PUBLIC_USERFRONT_ACCOUNT_ID,
			PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
		);

		if (!userfrontPayloads?.access && !['/', '/login', '/reset'].includes($page.url.pathname)) {
			console.log('goto /login');
			goto('/login');
		}
	});
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/login">Login</a></li>
		<li><a href="/reset">Reset</a></li>
		<li><a href="/dashboard">Dashboard</a></li>
	</ul>
</nav>

<slot />
