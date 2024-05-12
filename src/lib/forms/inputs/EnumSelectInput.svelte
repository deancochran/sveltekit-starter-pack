<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { InputConstraint } from 'sveltekit-superforms';
	export let value: any = undefined;
	export let enumType: any;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;

	const enumOptions = Object.values(enumType).map((val) => ({
		value: val,
		label: val
	}));
	const dispatch = createEventDispatcher();
</script>

<label class="label w-full">
	{#if label}<span>{label}</span><br />{/if}

	<select
		on:change={(e) => dispatch('change', e)}
		
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
		class="input {$$props.class}"
	>
		{#each enumOptions as option}
			<option value={option.value}>
				{option.label}
			</option>
		{/each}
	</select>
</label>
{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}
