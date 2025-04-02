import jwt, { type JwtPayload } from 'jsonwebtoken';

function getCookies(cookieString: string | null) {
	if (!cookieString) {
		return {};
	}

	return cookieString.split('; ').reduce((acc: Record<string, string>, cookie: string) => {
		const [key, value] = cookie.split('=');
		acc[key] = value;
		return acc;
	}, {});
}

import { err, ok, fromThrowable } from 'neverthrow';

// Define the type for your JWT payload
interface UserfrontJwtPayload extends JwtPayload {
	userId: string;
	tenantId: string; // Add any other properties you expect in the payload
}

// Create a function to verify the JWT synchronously using RS256
const safeVerify = fromThrowable(
	(token: string, publicKey: string): UserfrontJwtPayload => {
		return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as UserfrontJwtPayload; // Cast to your payload type
	},
	(e) => e as Error
);

export function verifyToken(publicKey: string, token: string) {
	const result = safeVerify(token, publicKey);
	if (result.isErr()) {
		return err(result.error);
	}
	if (typeof result.value === 'string') {
		return err(new Error('JWT payload expected to be an object; not a string'));
	}
	return ok(result.value);
}

// Parse userfront cookie into tokens.
// Inputs: Cookie string and tenantId.
// Outputs: Object with token names and tokens (same format as `Userfront.tokens`)

export function userfrontCookieToTokens(cookieString: string | null, tenantId: string) {
	if (!cookieString) {
		return null;
	}

	const accessTokenName = `access.${tenantId}`;
	const idTokenName = `id.${tenantId}`;
	const refreshTokenName = `refresh.${tenantId}`;

	const cookies = getCookies(cookieString);

	const accessToken = cookies[accessTokenName];
	const idToken = cookies[idTokenName];
	const refreshToken = cookies[refreshTokenName];

	return {
		accessTokenName,
		idTokenName,
		refreshTokenName,
		accessToken,
		idToken,
		refreshToken
	};
}
