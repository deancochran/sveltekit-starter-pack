<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

Welcome to your dashboard {data.user?.username}
