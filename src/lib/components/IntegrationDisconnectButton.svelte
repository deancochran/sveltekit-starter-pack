<script lang="ts">
	import type { ThirdPartyIntegrationProvider } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import type { DisconnectEvent, DisconnectEventDispatcher } from '$lib/components/IntegrationButtons/types';
	export let provider: ThirdPartyIntegrationProvider;

	let dispatch:DisconnectEventDispatcher = createEventDispatcher<DisconnectEvent>();

	function titleCase(provider: ThirdPartyIntegrationProvider) {
		return provider[0].toUpperCase() + provider.slice(1).toLowerCase();
	}
	$: title = titleCase(provider as ThirdPartyIntegrationProvider);
	let hovering = false;

	function toggleHovering(e: CustomEvent<any>): void {
		hovering = !hovering;
	}


	function dispatchProviderDisconnect(e: CustomEvent<any>): void {
		dispatch('disconnect', provider );
	}
</script>

<Button
	type="submit"
	on:mouseenter={toggleHovering}
	on:mouseleave={toggleHovering}
	on:click={dispatchProviderDisconnect}
	class="logo-item variant-ghost-primary hover:variant-ghost-warning transition-colors duration-300 ease-in-out"
>
	{#if hovering}
		Disconnect from
	{:else}
		Connected to
	{/if}

	{title}</Button
>
