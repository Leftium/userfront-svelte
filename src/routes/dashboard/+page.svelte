<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	const user = Userfront.user;

	export let data;

	const authorizationHeader = `Bearer ${data?.userfrontTokens?.accessToken}`;
</script>

<h1>Dashboard</h1>

<div>
	<h3>{user.name}</h3>
	<img src={user.image} alt="profile pic" />
</div>

<button on:click={() => Userfront.logout()}>Log out</button>

<pre>{JSON.stringify(user, null, 4)}</pre>

<hr />

<h3>Authorization header for API calls</h3>
<pre>{authorizationHeader}</pre>

<style>
	pre {
		text-align: left;
		max-width: 400px;
	}
</style>
