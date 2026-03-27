<script lang="ts">
	import '@leftium/nimble.css';

	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	// Also imports Userfront custom web components like <signup-form>.
	import Userfront from '@userfront/toolkit/web-components';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);
</script>

<main class="container">
	<nav>
		<ul>
			<li><a href="/">Home (Sign up)</a></li>
			<li><a href="/login">Login</a></li>
			<li><a href="/reset">Reset</a></li>
			<li><a href="/dashboard">Dashboard</a></li>
		</ul>
	</nav>

	<slot />

	<hr />

	<center>
		<footer>
			<a href="https://leftium.github.io/userfront-svelte">Documentation</a> |
			<a href="https://github.com/Leftium/userfront-svelte">Source code</a>
		</footer>
	</center>
</main>

<style>
	nav ul {
		display: flex;
		list-style: none;
		gap: 1rem;
		justify-content: center;
		padding: 0;
	}

	:global(h1) {
		text-align: center;
	}
</style>
