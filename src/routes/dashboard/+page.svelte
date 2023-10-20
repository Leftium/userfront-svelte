<script lang="ts">
	import { PUBLIC_USERFRONT_GLOBAL_TENANT } from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_GLOBAL_TENANT);

	export let data;
</script>

<h1>Dashboard</h1>

<button on:click={() => Userfront.logout()}>Log out</button>

<pre>{JSON.stringify(data, null, 4)}</pre>
