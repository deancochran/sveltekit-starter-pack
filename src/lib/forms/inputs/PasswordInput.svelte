<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: string;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
</script>

<label class="label">
	{#if label}<span>{label}</span><br />{/if}
	<input
		class="input"
		type="password"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
	/>
</label>
{#if errors}<span class="text-error-500">{errors}</span>{/if}
