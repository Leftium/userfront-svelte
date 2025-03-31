import * as jose from 'jose';

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

// Verify JWT token.
// Inputs: JWT public key and JWT token.
// Output: Decoded JWT token payload on successful verification; otherwise null.
// Side-effects: Logs errors while verifying token.

export async function verifyToken(publicKeyBase64: string, token?: string | null) {
	if (!token) {
		return null;
	}

	const userfrontPublicKey = atob(publicKeyBase64);
	const publicKey = await jose.importSPKI(userfrontPublicKey, 'RS256');

	try {
		const { payload } = await jose.jwtVerify(token, publicKey, {
			algorithms: ['RS256']
		});
		return payload;
	} catch (error) {
		console.error(error);
	}
	return null;
}

// Parse userfront cookie into tokens.
// Inputs: Cookie string and tenantId.
// Outputs: Object with token names and tokens (same format as `Userfront.tokens`)

export async function userfrontCookieToTokens(cookieString: string | null, tenantId: string) {
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
