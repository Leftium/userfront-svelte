import { USERFRONT_API_KEY } from '$env/static/private';
import { PUBLIC_USERFRONT_PUBLIC_KEY } from '$env/static/public';
import { verifyToken } from '$lib/index.js';
import { error, json } from '@sveltejs/kit';

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
		error(403, 'Error validating authorization token.');
	}

	const userId = result.value.userId;

	const response = await fetch(`https://api.userfront.com/v0/users/${userId}`, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${USERFRONT_API_KEY}`
		},
		body: JSON.stringify(payload)
	});

	console.log(response.status);
	console.log(response.statusText);

	const results = await response.json();
	console.log(results);

	return json(results);
};
