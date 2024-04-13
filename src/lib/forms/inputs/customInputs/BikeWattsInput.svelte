
<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: number = 0.5;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = {
		min: 0,
		max: 2000,
		step: 5
	};

	// clamp the value between min and max, or use the given value if outside of those bounds
	$: bike_watt_display = `${value.toString().padStart(2, '0')}`;
</script>

<label class="label w-full">
	{#if label}<span>{label}: {bike_watt_display}</span><br />{/if}
	<input
		type="range"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
		class="input"
	/>
</label>

{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}
