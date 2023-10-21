<script lang="ts">
	import '@picocss/pico';

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

<main class="container">
	<nav>
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/login">Login</a></li>
			<li><a href="/reset">Reset</a></li>
			<li><a href="/dashboard">Dashboard</a></li>
		</ul>
	</nav>

	<slot />
</main>

<style>
	main {
		max-width: 600px;
	}

	nav {
		justify-content: center;
	}

	:global(h1) {
		text-align: center;
	}
</style>
