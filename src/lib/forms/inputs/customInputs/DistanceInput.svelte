<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// VALUE IS ALWAYS IN KM, but can display Meters or KM

	import type { InputConstraint } from 'sveltekit-superforms';
	export let selectedUnit: 'km' | 'm' = 'km';
	const dispatch = createEventDispatcher();
	$: valueInMetres = (value * 1000)??0;
	$: valueInKm = (value)??0;

	export let name: string;
	export let value: number = 0;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
	let distance: number;
	if (!value) distance = 0;
	else{
		if(selectedUnit === 'm') distance = value * 1000;
		else distance = value;
	}

	$: {
		value = selectedUnit === 'm' ? distance / 1000 : distance;
	}
</script>

<label class="label w-full">
	{#if label}<span
			>{label}: {#if selectedUnit === 'm'}{valueInMetres}m{:else}{valueInKm}km{/if}</span
		>{/if}

	<input
		disabled={$$props.disabled}
		{name}
		class="input w-full"
		type="number"
		step={selectedUnit === 'm' ? '25' : '0.1'}
		min="0"
		bind:value={distance}
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
