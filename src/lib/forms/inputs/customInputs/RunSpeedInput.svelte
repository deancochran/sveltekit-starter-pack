<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';
	import { createEventDispatcher } from 'svelte';
	export let value: number;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = {
		min: 120,
		max: 480,
		step: 5
	};

	const dispatch = createEventDispatcher();
export let value: number = Math.ceil(user.run_ftp / 5) * 5;
	$: {
		interval.intensity = 1 - value / user.run_ftp + 1;
	}
	$: run_ftp_display = `${Math.floor(value / 60)
		.toString()
		.padStart(2, '0')}:${(value % 60).toFixed(0).padStart(2, '0')}`;
</script>

<label class="label w-full">
	{#if label}<span>{label}: {run_ftp_display}/km</span><br />{/if}
	<input
		class="number"
		type="range"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		on:input={(e) => dispatch('input', e)}
		{...constraints}
		{...$$restProps}
	/>
</label>

{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}
