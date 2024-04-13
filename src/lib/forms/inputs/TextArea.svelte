<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: string | undefined = undefined;
	export let rows: number = 2;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
</script>

<label class="label w-full">
	{#if label}<span>{label}</span><br />{/if}
	<textarea
		{rows}
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
		class="textarea {$$props.class}"
	/>
</label>
{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}
