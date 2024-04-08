<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: number;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
</script>

<label class="label w-full">
	{#if label}<span>{label}: {value} BPM</span><br />{/if}
	<input
		class="input"
		type="range"
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
