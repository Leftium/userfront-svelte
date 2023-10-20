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
<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/login">Login</a></li>
		<li><a href="/reset">Reset</a></li>
		<li><a href="/dashboard">Dashboard</a></li>
	</ul>
</nav>

<slot />
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


## Signup, login, and password reset

We'll start by adding a signup form to the home page.

Install the Userfront Toolkit with:

```sh
npm install -D @userfront/toolkit --save
```

We will use Userfront tools on multiple pages, so we can initialize it once in the `+layout.svelte` file.

Replace `USERFRONT_TENANT_ID` with your Userfront tenant id. (From your [dashboard](https://userfront.com/dashboard))

```svelte
<!-- src/routes/+layout.svelte --!>

<script lang="ts">
	import Userfront from '@userfront/core';
	Userfront.init('USERFRONT_TENANT_ID');
</script>

<nav>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/login">Login</a></li>
		<li><a href="/reset">Reset</a></li>
		<li><a href="/dashboard">Dashboard</a></li>
	</ul>
</nav>

<slot />
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


## Protected route in SvelteKit

Usually, we don't want users to be able to view the dashboard unless they are logged in. This is known as protecting a route.

Whenever a user is not logged in but tries to visit `/dashboard`, we can redirect them to the login screen.
