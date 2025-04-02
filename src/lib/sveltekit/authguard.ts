import { PUBLIC_USERFRONT_ACCOUNT_ID, PUBLIC_USERFRONT_PUBLIC_KEY } from '$env/static/public';

import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { userfrontCookieToTokens, verifyToken } from '$lib/parse-userfront-cookies';
import { err, ok } from 'neverthrow';

export function getUserfrontData() {
	const event = getRequestEvent();
	const cookie = event.request.headers.get('cookie');
	const tokens = userfrontCookieToTokens(cookie, PUBLIC_USERFRONT_ACCOUNT_ID);

	if (!tokens?.accessToken) return err(new Error('access token not found'));
	if (!tokens.idToken) return err(new Error('id token not found'));

	const resultAccessTokenPayload = verifyToken(PUBLIC_USERFRONT_PUBLIC_KEY, tokens.accessToken);
	const resultIdTokenPayload = verifyToken(PUBLIC_USERFRONT_PUBLIC_KEY, tokens.idToken);

	if (resultAccessTokenPayload.isErr()) return err(resultAccessTokenPayload.error);
	if (resultIdTokenPayload.isErr()) return err(resultIdTokenPayload.error);

	const user = {
		...resultIdTokenPayload.value,
		authentication: resultAccessTokenPayload.value.authentication,
		authorization: resultAccessTokenPayload.value.authorization
	};

	const userfrontAuthenticatedUser = {
		user,
		tokens
	};

	//console.log(JSON.stringify(userfrontAuthenticatedUser, null, 4));
	return ok(userfrontAuthenticatedUser);
}

// Based on: https://www.captaincodeman.com/securing-your-sveltekit-app
export class RequireLogin {
	public user;
	public roles;

	// - Sets flag `event.locals.hasAuthGuard` (checked by handleMissingAuthGuard())
	// - Populates this.user, this.roles
	// - Redirects/errors as needed
	constructor({ loginRedirect } = { loginRedirect: '/login' }) {
		const { locals } = getRequestEvent();
		//console.log('set locals.hasAuthGuard = true');
		locals.hasAuthGuard = true;

		const result = getUserfrontData();
		if (result.isErr()) {
			if (loginRedirect) {
				redirect(302, loginRedirect);
			}
			error(401, `Login required. (${result.error.message})`);
		}

		this.user = result.value.user;
		this.roles = this.user.authorization[this.user.tenantId]?.roles;
	}

	andAdmin(customMessage?: string) {
		return this.andRole('admin', customMessage || 'Not authorized; not an admin.');
	}

	andRole(role: string, customMessage?: string) {
		if (!this.roles.includes(role)) {
			const message = customMessage || `Not authorized; missing role: $ROLE.`;
			error(403, message.replace('$ROLE', role));
		}
		return this;
	}

	andAnyRole(roles: string[], customMessage?: string) {
		if (!roles.some((role) => this.roles.includes(role))) {
			const message = customMessage || `Not authorized; missing any role: $ROLES}.`;
			error(403, message.replace('$ROLES', roles.join(', ')));
		}
		return this;
	}

	andAllRoles(roles: string[], customMessage?: string) {
		if (!roles.every((role) => this.roles.includes(role))) {
			const missing = roles.filter((role) => !this.roles.includes(role)).join(', ');
			const message = customMessage || `Not authorized; missing roles: $MISSING.`;
			error(403, message.replace('$MISSING', missing));
		}
		return this;
	}
}
