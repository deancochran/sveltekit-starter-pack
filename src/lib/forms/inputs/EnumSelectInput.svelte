<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';
	export let value: any;
	export let enumType: any;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;

	const enumOptions = Object.values(enumType).map((val) => ({
		value: val,
		label: val,
	}));
</script>

<label class="label w-full">
	{#if label}<span>{label}</span><br />{/if}

	<select
		class="input"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
	>
		<option value="None" selected={!value}>No selection</option>
		{#each enumOptions as option}
			<option value={option.value} selected={value === option.value}>
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

