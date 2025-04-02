// hooks.server.ts

import { handleMissingAuthGuard } from '$lib/sveltekit';

export const handle = handleMissingAuthGuard;
