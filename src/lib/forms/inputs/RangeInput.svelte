<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	export let superform: SuperForm<T>;
	export let field: FormPathLeaves<T>;

	const { value, errors, constraints } = formFieldProxy(superform, field);
</script>

<input
	name={field}
	type="range"
	aria-invalid={$errors ? 'true' : undefined}
	bind:value={$value}
	{...$constraints}
	{...$$restProps}
	class="input {$$props.class}"
/>
{#if errors}<span class="invalid">{errors}</span>{/if}
