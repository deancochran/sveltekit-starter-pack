<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { Eye, EyeOff } from 'lucide-svelte';
	import {
		formFieldProxy,
		type FormPathLeaves,
		type SuperForm
	} from 'sveltekit-superforms';

	export let superform: SuperForm<T>;
	export let field: FormPathLeaves<T>;

	const { value, errors, constraints } = formFieldProxy(superform, field);
	let show = false;
</script>

<div class="class relative">
	<input
		name={field}
		{...{ type: show ? 'text' : 'password' }}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...$$restProps}
		class="input {$$props.class}"
	/>
	<button
		class="absolute top-0 bottom-0 right-4"
		tabindex="-1"
		type="button"
		on:click|stopPropagation|preventDefault={() => (show = !show)}
	>
		{#if show}
			<Eye />
		{:else}
			<EyeOff />
		{/if}
	</button>
</div>

{#if $errors}<span class="invalid">{$errors}</span>{/if}
