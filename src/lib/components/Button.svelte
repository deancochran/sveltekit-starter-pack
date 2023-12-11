<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let size:
		| 'btn-sm'
		| 'btn-md'
		| 'btn-lg'
		| 'btn-icon-xl'
		| 'btn-icon-sm'
		| 'btn-icon-md'
		| 'btn-icon-lg'
		| 'btn-icon-xl'
		| undefined = undefined;
	export let color:
		| 'variant-soft-primary'
		| 'variant-soft-secondary'
		| 'variant-soft-tertiary'
		| 'variant-filled-primary'
		| 'variant-filled-secondary'
		| 'variant-filled-tertiary'
		| undefined = undefined;

	export let shadow: 'shadow-md' | undefined = undefined;
	let classes = `${size} ${color} ${shadow} ${$$props.class}`;
	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => dispatch('click')}
	{...$$props}
	{type}
	class:transition-colors={true}
	class:duration-300={true}
	class={classes}
>
	<slot /></button
>
