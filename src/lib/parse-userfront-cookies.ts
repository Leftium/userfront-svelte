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

async function verifyToken(token: string | null, publicKey: KeyLike) {
	if (!token) {
		return null;
	}

	try {
		const { payload } = await jose.jwtVerify(token, publicKey, {
			algorithms: ['RS256']
		});
		return payload;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function parseUserfrontCookies(
	cookies: string | null,
	tenantId: string,
	publicKeyBase64: string
) {
	if (!cookies) {
		return null;
	}

	const userfrontPublicKey = atob(publicKeyBase64);
	const publicKey = await jose.importSPKI(userfrontPublicKey, 'RS256');

	const idTokenEncoded = getCookie(`id.${tenantId}`, cookies);
	const accessTokenEncoded = getCookie(`access.${tenantId}`, cookies);
	const refreshTokenEncoded = getCookie(`refresh.${tenantId}`, cookies);

	const idToken = (await verifyToken(idTokenEncoded, publicKey)) as TokenPayload;
	const accessToken = (await verifyToken(accessTokenEncoded, publicKey)) as ExtendedJWTPayload;
	const refreshToken = (await verifyToken(refreshTokenEncoded, publicKey)) as JWTPayload;

	return {
		idToken,
		accessToken,
		refreshToken
	};
}
