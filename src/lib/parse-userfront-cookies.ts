import * as jose from 'jose';
import type { JWTPayload, KeyLike } from 'jose';

interface ExtendedJWTPayload extends JWTPayload {
	authorization: Record<string, { roles: string[] }>;
}

interface TokenPayload extends JWTPayload {
	userId: number;
	name: string;
	email: string;
	data: unknown;
}

function getCookie(name: string, cookieString: string | null) {
	if (!cookieString) {
		return null;
	}

	const cookieObject = cookieString
		.split('; ')
		.reduce((acc: Record<string, string>, cookie: string) => {
			const [key, value] = cookie.split('=');
			acc[key] = value;
			return acc;
		}, {});

	return cookieObject[name] || null;
}

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

export async function userfrontCookieToTokens(cookies: string | null, tenantId: string) {
	if (!cookies) {
		return null;
	}

	const accessTokenName = `access.${tenantId}`;
	const idTokenName = `id.${tenantId}`;
	const refreshTokenName = `refresh.${tenantId}`;

	const idToken = getCookie(accessTokenName, cookies);
	const accessToken = getCookie(idTokenName, cookies);
	const refreshToken = getCookie(refreshTokenName, cookies);

	return {
		accessTokenName,
		idTokenName,
		refreshTokenName,
		accessToken,
		idToken,
		refreshToken
	};
}
