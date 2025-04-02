import { RequireLogin } from '$lib/sveltekit';

// Protected route. Redirect if not logged in. Show error when insufficient roles.
// Reference: https://svelte.dev/docs/kit/load#Using-getRequestEvent
export const load = async () => {
	const { user, roles } = new RequireLogin();
	//new RequireLogin().andAdmin();
	//new RequireLogin().andRole('member');
	//new RequireLogin().andAllRoles(['admin', 'member']);

	console.log(user);
	console.log(roles);
};
