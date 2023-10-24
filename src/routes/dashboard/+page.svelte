<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	import Userfront from '@userfront/toolkit/web-components';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	let user = Userfront.user;

	// Bindings:
	let name = user.name || '';
	let phoneNumber = user.phoneNumber || '+13335557777';
	let authorizationHeader = `Bearer ${Userfront.tokens.accessToken}`;

	async function handleSubmit() {
		const payload = {
			name,
			phoneNumber
		};

		const response = await fetch('/api/update-user', {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
				authorization: authorizationHeader
			},
			body: JSON.stringify(payload)
		});

		await Userfront.tokens.refresh();
		user = Userfront.user;

		console.log(response);
		console.log(await response.json());
	}
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
			<label>Name<input bind:value={name} /></label>
			<label>Phone Number<input bind:value={phoneNumber} /></label>
			<label>
				Authorization Header
				<input bind:value={authorizationHeader} />
			</label>

			<input type="submit" on:click={handleSubmit} value="Fetch /api/update-user endpoint" />
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
