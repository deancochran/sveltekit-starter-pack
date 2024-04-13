<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { InputConstraint } from 'sveltekit-superforms';

	export let name: string;
	export let value: number = 0;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;

	const dispatch = createEventDispatcher();

	$: valueInMetres = value ?? 0

</script>

<label class="label w-full">
	{#if label}<span
			>{label}:{valueInMetres}m</span
		>{/if}

	<input
		disabled={$$props.disabled}
		{name}
		class="input w-full"
		type="number"
		step={'25'}
		min="0"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		on:input={(e) => {
			dispatch('input', e);
		}}
		{...constraints}
		{...$$restProps}
	/>
</label>

{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}
