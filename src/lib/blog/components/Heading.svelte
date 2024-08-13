<script lang="ts">
	import { onMount } from 'svelte';

	let slotId = '';
	let slotContentElement: HTMLHeadingElement;

	onMount(() => {
		// Set the slotId based on the slot content
		const slotContent = slotContentElement.innerText.trim();
		slotId = slotContent.toLowerCase().replace(/\s+/g, '-');
	});
</script>

<h1 class=" leading-snug {$$props.class}" id={slotId} bind:this={slotContentElement}>
	<slot />
</h1>
