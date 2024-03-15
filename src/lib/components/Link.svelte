<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let href: string;
	export let type: 'btn' | 'btn-icon' | 'logo-item' = 'btn';
	export let target: '_blank' | undefined = undefined;
	export let rel: 'noreferrer' | undefined = undefined;
	export let color:
		| 'variant-soft-primary'
		| 'variant-soft-secondary'
		| 'variant-soft-tertiary'
		| 'variant-filled-primary'
		| 'variant-filled-secondary'
		| 'variant-filled-tertiary'
		| undefined = undefined;
	export let shadow: 'shadow-md' | undefined = undefined;
	export let label: string;
	let classes = `${type} ${color} ${shadow}`;
	const dispatch = createEventDispatcher();
</script>

<a
	aria-label={label}
	class:transition-colors={true}
	class:duration-300={true}
	class={classes}
	{target}
	{rel}
	data-sveltekit-preload-data="tap"
	on:click={() => dispatch('click')}
	{...$$props}
	{href}><slot /></a
>
