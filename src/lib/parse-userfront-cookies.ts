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
		console.log('Missing token!');
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
	cookies: string,
	tenantId: string,
	publicKeyBase64: string
) {
	const userfrontPublicKey = atob(publicKeyBase64);
	const publicKey = await jose.importSPKI(userfrontPublicKey, 'RS256');

	const idToken = getCookie(`id.${tenantId}`, cookies);
	const accessToken = getCookie(`access.${tenantId}`, cookies);
	const refreshToken = getCookie(`refresh.${tenantId}`, cookies);

	console.log(idToken, accessToken);

	const id = (await verifyToken(idToken, publicKey)) as TokenPayload;
	const access = (await verifyToken(accessToken, publicKey)) as ExtendedJWTPayload;
	const refresh = (await verifyToken(refreshToken, publicKey)) as JWTPayload;

	return {
		id,
		access,
		refresh
	};
}