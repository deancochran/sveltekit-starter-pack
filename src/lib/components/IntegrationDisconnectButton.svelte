<script lang="ts">
	import type {
		DisconnectEvent,
		DisconnectEventDispatcher
	} from '$lib/components/IntegrationButtons/types';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	export let provider: string;

	let dispatch: DisconnectEventDispatcher =
		createEventDispatcher<DisconnectEvent>();

	// TODO Redo this function
	function titleCase(provider: string) {
		// return provider[0].toUpperCase() + provider.slice(1).toLowerCase();
		return provider;
	}
	$: title = titleCase(provider);
	let hovering = false;

	function toggleHovering(): void {
		hovering = !hovering;
	}

	function dispatchProviderDisconnect(): void {
		dispatch('disconnect', provider as 'STRAVA' | 'WAHOO');
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
