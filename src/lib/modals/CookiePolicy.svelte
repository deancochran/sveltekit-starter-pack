<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modal = getModalStore();

	function close() {
		modal.close();
	}
</script>

{#if $modal[0]}
	<div class="card w-[80vw]">
		<header class="card-header">
			<h1 class="h1 w-full text-center">Cookie Policy</h1>
		</header>
		<section class="p-4">(content)</section>
		<footer class="card-footer w-full flex justify-end">
			<Button on:click={close}>Close</Button>
		</footer>
	</div>
{/if}
