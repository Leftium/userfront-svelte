# Userfront Svelte auth example

In this example, we will add authentication and access control to a SvelteKit application.

The `userfront-svelte` package _does_ work with plain Svelte, but we will use SvelteKit for setup and routing.

## Svelte authentication

At a high level, Svelte's responsibility in authentication is to:

1. Send an initial request to Userfront to get the JWT access token. This is what the signup and login forms do.
2. Send the JWT access token to your server with each subsequent request.

![image](https://github.com/Leftium/userfront-svelte/assets/381217/a2ad08a4-aae2-4f52-ba01-4ae733049be8)

## Set up SvelteKit

```bash
npm create svelte@latest my-app
cd my-app
npm install
npm run dev -- --open
```

Select the options as you go. In this example, we set up SvelteKit with the following:

- Skeleton project
- Typescript
- ESLint
- Prettier

Now our application is available at [http://localhost:5173/](http://localhost:5173/)

## Routing

We'll set up a simple app with routing. This is all we need to start adding authentication.

| Route        | Description                              |
| ------------ | ---------------------------------------- |
| `/`          | Home page                                |
| `/login`     | Login page                               |
| `/reset`     | Password reset page                      |
| `/dashboard` | User dashboard, for logged in users only |

Add `src/routes/+layout.svelte` with the following to add a simple navigation menu:

```svelte
<!-- src/routes/+layout.svelte -->
<center>
	<a href="/">Home</a> |
	<a href="/login">Login</a> |
	<a href="/reset">Reset</a> |
	<a href="/dashboard">Dashboard</a>

	<slot />
</center>
```

Then add placeholders for each route:

```svelte
<!-- src/routes/+page -->

<h1>Home</h1>
```

```svelte
<!-- src/routes/login/+page -->

<h1>Login</h1>
```

```svelte
<!-- src/routes/reset/+page -->

<h1>Reset</h1>
```

```svelte
<!-- src/routes/dashboard/+page -->

<h1>Dashboard</h1>
```

With our routes in place, we are ready to add authentication.

## Userfront environment variables

Add the file `env.locals` to the root of your project folder and fill in your account details.
They will be used in the next steps.

Instead of hard-coding them, SvelteKit provides access to environment variables:

- [$env/static/private](https://kit.svelte.dev/docs/modules#$env-static-private)
- [$env/static/public](https://kit.svelte.dev/docs/modules#$env-static-public)

```sh
# /env.locals

# Find your account (global tenant) id here: https://userfront.com/test/dashboard/settings
PUBLIC_USERFRONT_ACCOUNT_ID=

# Find your key here (use base64 version): https://userfront.com/test/dashboard/jwt
PUBLIC_USERFRONT_PUBLIC_KEY_BASE64=

# Find your key here: https://userfront.com/test/dashboard/api-keys
USERFRONT_API_KEY=
```


## Signup, login, and password reset

We'll start by adding a signup form to the home page.

Install the Userfront Toolkit with:

```sh
npm install -D @userfront/toolkit --save
```

We will use Userfront tools on multiple pages, so we can initialize it once in the `+layout.svelte` file.

```svelte
<!-- src/routes/+layout.svelte --!>

<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';
	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);
</script>

<center>
	<a href="/">Home</a> |
	<a href="/login">Login</a> |
	<a href="/reset">Reset</a> |
	<a href="/dashboard">Dashboard</a>

	<slot />
</center>
```

Now we can add the signup form to the home page by replacing the contents of `src/routes/+page.svelte` with the template from the instructions:

```svelte
<!-- src/routes/+page.svelte -->

<script lang="ts">
	import { SignupForm } from 'userfront-svelte';
</script>

<h1>Home</h1>

<SignupForm />
```

Now the home page has your signup form. Try signing up a user.


## Test mode

The form is in "Test mode" by default, which will create user records in a test environment you can view separately in your Userfront dashboard.

![image](https://github.com/Leftium/userfront-svelte/assets/381217/4928d31f-c609-4b27-af7d-5f3ba6020a56)


## Login and password reset

Continue by adding your login and password reset forms in the same way that you added your signup form:

```svelte
<!-- src/routes/login/+page.svelte -->

<script lang="ts">
	import { LoginForm } from 'userfront-svelte';
</script>

<h1>Login</h1>

<LoginForm />
```

```svelte
<!-- src/routes/reset/+page.svelte -->

<script lang="ts">
	import { PasswordResetForm } from 'userfront-svelte';
</script>

<h1>Reset</h1>

<PasswordResetForm />
```

At this point, your signup, login, and password reset should all be functional.

Your users can sign up, log in, and reset their password.

## Dashboard page

Whenever a user does log in, we want to show them some relevant information and also give them the ability to log out.

For the dashboard page, we can add information about the user by referencing the `Userfront.user` object.

We can log the user out by calling `Userfront.logout()`.

Replace the `src/routes/dashboard/+page.svelte` file with the following:

```svelte
<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	const user = Userfront.user;
</script>

<h1>Dashboard</h1>

<div>
	<h3>{user.name}</h3>
	<img src={user.image} alt="profile pic" />
</div>

<button on:click={() => Userfront.logout()}>Log out</button>

<pre>{JSON.stringify(user, null, 4)}</pre>

<style>
	pre {
		text-align: left;
		max-width: 400px;
	}
</style>

```



## Protected route in SvelteKit

Usually, we don't want users to be able to view the dashboard unless they are logged in. This is known as protecting a route.

Whenever a user is not logged in but tries to visit `/dashboard`, we can redirect them to the login screen.

SvelteKit has both server-side and client-side routing, so we need to redirect in both.

`parseUserfrontCookies()` is a helper function that parses/decodes Userfront cookies on both the server and client.

### Server-side guard/redirection

Add the file `src/hooks.server.ts` to add protection/redirection via the
[`handle()` hook](https://kit.svelte.dev/docs/hooks#server-hooks-handle)
and [redirect()](https://kit.svelte.dev/docs/load#redirects):

```ts
import { redirect } from '@sveltejs/kit';
import {
	PUBLIC_USERFRONT_ACCOUNT_ID,
	PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
} from '$env/static/public';
import { parseUserfrontCookies } from 'userfront-svelte';

export async function handle({ event, resolve }) {
	const { pathname } = event.url;

	const cookies = event.request.headers.get('cookie');

	const userfrontPayloads = await parseUserfrontCookies(
		cookies,
		PUBLIC_USERFRONT_ACCOUNT_ID,
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
	);

	if (!userfrontPayloads?.access && !['/', '/login', '/reset'].includes(pathname)) {
		throw redirect(302, '/login');
	}

	return resolve(event);
}
```

### Client-side guard/redirection

Replace the file `src/routes/+layout.svelte` to add protection/redirection via
[`beforeNavigate()`](https://kit.svelte.dev/docs/modules#$app-navigation-beforenavigate)
and [`goto()`](https://kit.svelte.dev/docs/modules#$app-navigation-goto):

```svelte
<!-- src/routes/+layout.svelte -->

<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { parseUserfrontCookies } from '$lib/index.js';

	import {
		PUBLIC_USERFRONT_ACCOUNT_ID,
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
	} from '$env/static/public';

	import Userfront from '@userfront/core';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	beforeNavigate(async (navigation) => {
		const toPathname = navigation.to?.url.pathname as string;
		const userfrontPayloads = await parseUserfrontCookies(
			document.cookie,
			PUBLIC_USERFRONT_ACCOUNT_ID,
			PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
		);

		if (!userfrontPayloads?.access && !['/', '/login', '/reset'].includes(toPathname)) {
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

```
