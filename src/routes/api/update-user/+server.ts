import { USERFRONT_API_KEY } from '$env/static/private';
import { PUBLIC_USERFRONT_PUBLIC_KEY_BASE64 } from '$env/static/public';
import { verifyToken } from '$lib/index.js';
import { error, json } from '@sveltejs/kit';

export const PUT = async ({ request }) => {
	const payload = await request.json();
	const authHeader = request.headers.get('authorization');

	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		throw error(401, 'Missing authorization token.');
	}

	const auth = await verifyToken(PUBLIC_USERFRONT_PUBLIC_KEY_BASE64, token);
	if (!auth) {
		throw error(401, 'Invalid token.');
	}

	const userId = auth.userId;

	const response = await fetch(`https://api.userfront.com/v0/users/${userId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${USERFRONT_API_KEY}`
		},
		body: JSON.stringify(payload)
	});

	console.log(response.status);
	console.log(response.statusText);

	const results = await response.json();
	console.log(results);

	return json(results);
};
