# Userfront Svelte auth example
In this example, we will add authentication and access control to a SvelteKit application.

The `userfront-svelte` works with plain Svelte, but we will use SvelteKit for setup and routing.

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

Now our application is available at http://localhost:5173/

## Routing

We'll set up a simple app with routing. This is all we need to start adding authentication.

Route        | Description
------------ | ---------------------------------------         
`/`          | Home page
`/login`     | Login page
`/reset`     | Password reset page
`/dashboard` | User dashboard, for logged in users only

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





