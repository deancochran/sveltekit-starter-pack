<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import {
		formFieldProxy,
		type FormFieldProxy,
		type SuperForm,
		type FormPathLeaves
	} from 'sveltekit-superforms';

	import InputLabel from './InputLabel.svelte';

	export let superform: SuperForm<T>;
	export let field: FormPathLeaves<T>;

	const { value, errors, constraints } = formFieldProxy(superform, field);

	export let enumType: any;

	const enumOptions = Object.values(enumType).map((val) => ({
		value: val,
		label: val
	}));
</script>

<select
	name={field}
	aria-invalid={$errors ? 'true' : undefined}
	bind:value={$value}
	{...$constraints}
	{...$$restProps}
	class="input {$$props.class}"
>
	{#each enumOptions as option}
		<option value={option.value}>
			{option.label}
		</option>
	{/each}
</select>
{#if errors}<span class="invalid">{errors}</span>{/if}
