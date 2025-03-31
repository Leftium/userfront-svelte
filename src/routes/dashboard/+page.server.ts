import { redirect } from '@sveltejs/kit';

// Protected route. Redirect if not logged in.
// Reference: https://github.com/sveltejs/realworld/blob/0e44badcc994adb277cd6ac274c126b89a91df8c/src/routes/editor/%2Bpage.server.js#L6
export const load = async ({ locals }) => {
	// Auth guard:
	if (!locals.auth) redirect(302, `/login`);
};
