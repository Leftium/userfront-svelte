// hooks.server.ts

import { handleMissingAuthGuard } from '$lib/sveltekit/handle-missing-auth-guard';

export const handle = handleMissingAuthGuard;
