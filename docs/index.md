# Userfront Svelte auth example

Svelte port of Userfront examples based on:

- [https://userfront.com/examples/react](https://userfront.com/examples/react)
- [https://userfront.com/examples/vue](https://userfront.com/examples/vue)

### Live demo

[https://userfront-svelte-leftium.vercel.app](https://userfront-svelte-leftium.vercel.app)

### Source code

[https://github.com/Leftium/userfront-svelte](https://github.com/Leftium/userfront-svelte)

## Step-by-step tutorial:

In this example, we will add authentication and access control to a SvelteKit application.

The `userfront-svelte` package _does work with plain Svelte_, but we will use SvelteKit for setup and routing.

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

### Making it prettier _(optional)_

This example uses Pico CSS for nice-looking default semantic styles.

```sh
npm install @picocss/pico@next --save
```

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
<script lang="ts">
	import '@picocss/pico';
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

SvelteKit provides access to environment variables so we can avoid hard-coding them:

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

Install the required packages with:

```sh
npm install -D @userfront/toolkit userfront-svelte --save
```

We will use Userfront tools on multiple pages, so we can initialize it once in the `+layout.svelte` file.

```svelte
<!-- src/routes/+layout.svelte --!>

<script lang="ts">
	import '@picocss/pico';

	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';
	import Userfront from '@userfront/toolkit/web-components';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);
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
```

Now we can add the signup form to the home page just by adding the appropriate web component in `src/routes/+page.svelte`:

```svelte
<!-- src/routes/+page.svelte -->

<h1>Home</h1>

<signup-form />
```

Now the home page has your signup form. Try signing up a user.

## Test mode

The form is in "Test mode" by default, which will create user records in a test environment you can view separately in your Userfront dashboard.

![image](https://github.com/Leftium/userfront-svelte/assets/381217/4928d31f-c609-4b27-af7d-5f3ba6020a56)

## Login and password reset

Continue by adding your login and password reset forms in the same way that you added your signup form:

```svelte
<!-- src/routes/login/+page.svelte -->

<h1>Login</h1>

<login-form redirect-on-load-if-logged-in="true" />
```

```svelte
<!-- src/routes/reset/+page.svelte -->

<h1>Reset</h1>

<password-reset-form />
```

At this point, your signup, login, and password reset should all be functional.

Your users can sign up, log in, and reset their password.

## Dashboard page

Whenever a user does log in, we want to show them some relevant information and also give them the ability to log out.

For the dashboard page, we can add information about the user by referencing the `Userfront.user` object.

We can log the user out by calling `Userfront.logout()`.

Replace the `src/routes/dashboard/+page.svelte` file with the following:

```svelte
<!-- src/routes/dashboard/+page.svelte -->

<script lang="ts">
	import { PUBLIC_USERFRONT_ACCOUNT_ID } from '$env/static/public';

	import Userfront from '@userfront/toolkit/web-components';
	Userfront.init(PUBLIC_USERFRONT_ACCOUNT_ID);

	const { user } = Userfront;
</script>

<h1>Dashboard</h1>

<article>
	<header>
		<h4>{user.name || user.email}</h4>
		<button on:click={() => Userfront.logout()}>Log out</button>
	</header>

	<textarea readonly rows="6">Userfront.user = {JSON.stringify(user, null, 4)}</textarea>
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
```

## Protected route in SvelteKit

Usually, we don't want users to be able to view the dashboard unless they are logged in. This is known as protecting a route.

Whenever a user is not logged in but tries to visit `/dashboard`, we can redirect them to the login screen.

`userfrontCookieToTokens()` and `verifyToken()` are helper functions that parse/decode Userfront cookies on both the server and client.

Add the file `src/hooks.server.ts` to pass auth info from the UserFront JWT to SvelteKit's request event:

```ts
// src/hooks.server.ts

import {
	PUBLIC_USERFRONT_ACCOUNT_ID,
	PUBLIC_USERFRONT_PUBLIC_KEY_BASE64
} from '$env/static/public';

import { userfrontCookieToTokens, verifyToken } from 'userfront-svelte';

export async function handle({ event, resolve }) {
	const cookie = event.request.headers.get('cookie');
	const userfrontTokens = await userfrontCookieToTokens(cookie, PUBLIC_USERFRONT_ACCOUNT_ID);

	event.locals.auth = await verifyToken(
		PUBLIC_USERFRONT_PUBLIC_KEY_BASE64,
		userfrontTokens?.accessToken
	);

	return resolve(event);
}
```

Then add the file `src/routes/dashboard/+page.server.ts` to protect the `/dashboard` route.
Each protected route needs a +page.server file like this:

```ts
// src/routes/dashboard/+page.server.ts

import { redirect } from '@sveltejs/kit';

// Protected route. Redirect if not logged in.
export const load = async ({ locals }) => {
	if (!locals.auth) throw redirect(302, `/login`);
};
```

### Svelte authentication with an API

`Userfront.tokens.accessToken` is a JWT access token that you can
use on your backend to protect your API endpoints.

The SvelteKit client can send the JWT access token as a
`Bearer` token inside the `Authorization` header. For example:

```js
// Example of calling an endpoint with a JWT

const response = await fetch('/your-endpoint', {
	method: 'GET',
	headers: {
		'content-type': 'application/json',
		authorization: `Bearer ${Userfront.tokens.accessToken}`
	}
});
```

To handle a request like this, the (SvelteKit) backend should read the JWT access token
from the `Authorization` header and verify that it is valid using the JWT public key found
found in your Userfront dashboard.

Using this approach, any invalid or missing tokens are rejected by your server.
You can also reference the contents of the token later using the `auth` object:

```js
console.log(auth);

// =>
{
  mode: 'test',
  tenantId: 'demo1234',
  userId: 1,
  userUuid: 'ab53dbdc-bb1a-4d4d-9edf-683a6ca3f609',
  isConfirmed: false,
  authorization: {
    demo1234: {
      roles: ["admin"]
    },
  },
  sessionId: '35d0bf4a-912c-4429-9886-cd65a4844a4f',
  iat: 1614114057,
  exp: 1616706057
}
```

With this information, you can perform further checks as desired,
or use the `userId` or `userUuid` to look up information related to the user.

For example, if you wanted to limit a route to admin users, you could check
against the `authorization` object from the verified access token:

```js
// Javascript example

const authorization = auth.authorization['demo1234'] || {};

if (authorization.roles.includes('admin')) {
	// Allow access
} else {
	// Deny access
}
```

### Full SvelteKit API authentication example

- [`/api/update-user` +server endpoint that reads and verifies the JWT access token](https://github.com/Leftium/userfront-svelte/blob/main/src/routes/api/update-user/%2Bserver.ts)
- [+page that calls the endpoint](https://github.com/Leftium/userfront-svelte/blob/dc22a9425c96c6e6d6b14464c934346f03cd7c1e/src/routes/dashboard/%2Bpage.svelte#L20-L27)
- [Live Demo](https://userfront-svelte-leftium.vercel.app)

## Svelte SSO (Single Sign On)

From here, you can add social identity providers like Google, Facebook, and LinkedIn to your Svelte application, or business identity providers like Azure AD, Office365, and more.

To do this, create an application with the identity provider (e.g. Google), and then add those SSO credentials to the Userfront dashboard. The result is a modified sign on experience.

No additional code is needed to implement Single Sign On using this approach: you can add and remove providers without updating your forms or the way you handle JWT access tokens.
