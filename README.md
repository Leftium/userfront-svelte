# userfront-svelte: UserFront + Svelte(Kit)

1. Utilities that help [UserFront auth](https://userfront.com) to a (Svelte) project:
    - `RequireLogin`: auth guard that redirects/shows error when authorization requirements not met.
    - `handleMissingAuthGuard`: optional SvelteKit handle hook that prevents access of protected routes if they are missing an auth guard.
    - `UserfrontApi`: class that simplifies call to Userfront API.
    - `userfrontCookieToTokens()`: parse userfront cookie into tokens
    - `verifyToken()`: verify a JWT token; extract payload
3. Step-by-step tutorial: how to use UserFront + Svelte(Kit):
    - Live demo of results: https://userfront-svelte-leftium.vercel.app
 
## Installation & Usage

`npm install -D userfront-svelte`

*For usage, see tutorial below.*

## Step-By-Step Tutorial: How to Use UserFront + Svelte(Kit):

https://leftium.github.io/userfront-svelte
