<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: number;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
	$: duration_display = `${Math.floor(value / 60)
		.toString()
		.padStart(2, '0')}:${(value % 60).toFixed(0).padStart(2, '0')}`;
</script>

<label class="label w-full">
	{#if label}<span>{label}: {duration_display}hrs</span><br />{/if}
	<input
		class="input"
		type="number"
		bind:value
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

