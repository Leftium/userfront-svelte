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

<label>Name <input /></label>
<label><input type="checkbox" /> Send Authorization header</label>

<label>Authorization header <input value={authorizationHeader} /></label>

<button>Submit</button>

<style>
	pre {
		text-align: left;
		max-width: 440px;
	}

	label {
		display: block;
		max-width: 440px;
		margin-bottom: 1em;
		text-align: left;
		font-weight: bold;
	}

	input:not([type='checkbox']) {
		display: block;
		width: 100%;
	}
</style>
