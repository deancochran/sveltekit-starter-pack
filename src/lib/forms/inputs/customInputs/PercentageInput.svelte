<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: number = 0.5;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = {
		min: 0,
		max: 1,
		step: 0.01
	};

	// clamp the value between min and max, or use the given value if outside of those bounds
	$: percentage_display = Math.round(value * 100) + '%';
</script>

<label class="label w-full">
	{#if label}<span>{label}: {percentage_display}</span><br />{/if}
	<input
		type="number"
		step="0.01"
		min="0"
		max="1"
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
