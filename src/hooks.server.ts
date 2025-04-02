// hooks.server.ts

import { error, type Handle } from '@sveltejs/kit';

const protectedRouteRegex = /\/\(protected\)/;

const handleMissingAuthGuard: Handle = async ({ event, resolve }) => {
	const isProtectedRoute = event.route.id && protectedRouteRegex.test(event.route.id);

	console.log(`HANDLE          : ${event.route.id}`);
	console.log(`isProtectedRoute: ${isProtectedRoute}`);
	console.log(`isDataRequest   : ${event.isDataRequest}`);

	const resolved = isProtectedRoute ? await resolve(event) : await resolve(event);

	console.log(`hasAuthGuard: ${event.locals.hasAuthGuard}`);

	if (isProtectedRoute && !event.locals.hasAuthGuard) {
		error(400, `Protected route is missing an auth guard. (${event.route.id})`);
	}

	return resolved;
};

export const handle = handleMissingAuthGuard;
