<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	export let data;
</script>

<h1>Dashboard</h1>

<button on:click={() => Userfront.logout()}>Log out</button>

<pre>{JSON.stringify(data, null, 4)}</pre>
