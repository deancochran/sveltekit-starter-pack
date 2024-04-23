<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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
		| 'variant-filled-error'
		| 'variant-filled-warning'
		| 'variant-filled-success'
		| undefined = undefined;

	export let shadow: 'shadow-md' | undefined = undefined;
	let classes = `btn ${size ?? ''} ${color ?? ''} ${shadow ?? ''} ${$$props.class}`;
	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => dispatch('click')}
	on:mouseenter={() => dispatch('mouseenter')}
	on:mouseleave={() => dispatch('mouseleave')}
	class:transition-colors={true}
	class:duration-300={true}
	{...$$props}
	{...$$restProps}
	class="{$$props.class} {classes}"
>
	<slot /></button
>
