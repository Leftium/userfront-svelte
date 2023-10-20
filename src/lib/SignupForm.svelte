<script lang="ts">
	import Userfront from '@userfront/core';
	import { BROWSER } from 'esm-env';

	if (BROWSER) {
		import('@userfront/toolkit/web-components');
	}
</script>

<signup-form tenant-id={Userfront?.store?.tenantId} />
