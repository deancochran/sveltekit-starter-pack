<script lang="ts">
	import { fade } from 'svelte/transition';

	export let key: string;
</script>

{#key key}
	<div class="h-full w-full" in:fade>
		<slot />
	</div>
{/key}
