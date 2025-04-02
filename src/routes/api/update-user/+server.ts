import { USERFRONT_API_KEY } from '$env/static/private';
import { PUBLIC_USERFRONT_PUBLIC_KEY } from '$env/static/public';
import { error, json } from '@sveltejs/kit';
import { verifyToken } from '$lib/index.js';
import { UserfrontApi } from '$lib/userfront-api';

const userfrontApi = new UserfrontApi(USERFRONT_API_KEY);

export const PUT = async ({ request }) => {
	const payload = await request.json();

	// Read the JWT access token from the request header:
	const authHeader = request.headers.get('authorization');
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		error(401, 'Missing authorization token.');
	}

	// Verify the token using the Userfront public key:
	const result = verifyToken(PUBLIC_USERFRONT_PUBLIC_KEY, token);
	if (result.isErr()) {
		error(403, `Error validating authorization token. (${result.error})`);
	}

	const userId = result.value.userId;

	const results = await userfrontApi.PUT(`/users/${userId}`, {
		body: payload
	});
	console.log(results);

	return json(results);
};
