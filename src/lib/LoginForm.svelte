<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { Userfront } from '$lib/index.js';

	if (BROWSER) {
		import('@userfront/toolkit/web-components');
	}
</script>

<login-form tenant-id={Userfront?.store?.tenantId} />
