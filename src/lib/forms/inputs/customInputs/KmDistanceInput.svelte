<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let name: string;
	export let value: number;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
	let distance: number;
	if (value) distance = value / 1000;

	$: {
		value = distance * 1000 ?? 0;
	}

	$: valueInKM = value / 1000 ?? 0;
</script>

<label class="label w-full">
	{#if label}<span>{label}:{valueInKM ?? 0}km</span>{/if}

	<input
		disabled={$$props.disabled}
		{name}
		class="input w-full"
		type="number"
		min="0"
		step="0.1"
		bind:value={distance}
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
	/>
</label>

{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}
