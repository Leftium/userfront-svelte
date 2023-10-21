<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	const user = Userfront.user;

	export let data;

	const authorizationHeader = `Bearer ${data?.userfrontTokens?.accessToken}`;
</script>

<h1>Dashboard</h1>

<article>
	<header>
		<h4>{user.name || user.email}</h4>
		<button on:click={() => Userfront.logout()}>Log out</button>
	</header>

	<textarea readonly rows="6">Userfront.user = {JSON.stringify(user, null, 4)}</textarea>

	<section>
		<form action="">
			<label>Name<input /></label>
			<label>
				<input type="checkbox" />Send Authorization header:
			</label>
			<label>
				<input value={authorizationHeader} readonly on:focus={({ target }) => target?.select()} />
			</label>

			<input type="submit" />
		</form>
	</section>
</article>

<style>
	article header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	textarea {
		white-space: pre;
		overflow-wrap: normal;
		overflow-x: hidden;
	}
</style>
