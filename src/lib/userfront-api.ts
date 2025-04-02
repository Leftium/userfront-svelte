const USERFRONT_API_BASE_URL = 'https://api.userfront.com/v0';

export class UserfrontApi {
	constructor(private userfrontApiKey: string) {}

	async fetchUserFrontJson(endpoint: Parameters<typeof fetch>[0], options?: RequestInit) {
		const body = options?.body ? JSON.stringify(options?.body) : undefined;
		const headers = {
			...options?.headers,
			Authorization: `Bearer ${this.userfrontApiKey}`,
			'Content-Type': 'application/json',
			'X-Userfront-Svelte': '0.1.0'
		};

		const fetched = await fetch(USERFRONT_API_BASE_URL + endpoint, {
			...options,
			body,
			headers
		});

		return await fetched.json();
	}

	GET(url: Parameters<typeof fetch>[0], options?: RequestInit) {
		return this.fetchUserFrontJson(url, {
			...options,
			method: 'GET'
		});
	}

	POST(url: Parameters<typeof fetch>[0], options?: RequestInit) {
		return this.fetchUserFrontJson(url, {
			...options,
			method: 'POST'
		});
	}

	PUT(url: Parameters<typeof fetch>[0], options?: RequestInit) {
		return this.fetchUserFrontJson(url, {
			...options,
			method: 'PUT'
		});
	}

	DELETE(url: Parameters<typeof fetch>[0], options?: RequestInit) {
		return this.fetchUserFrontJson(url, {
			...options,
			method: 'DELETE'
		});
	}
}
