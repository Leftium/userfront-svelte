<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { Userfront } from '$lib';

	if (BROWSER) {
		import('@userfront/toolkit/web-components');
	}
</script>

<signup-form tenant-id={Userfront?.store?.tenantId} />
