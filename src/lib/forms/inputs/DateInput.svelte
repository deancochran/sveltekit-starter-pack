<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: Date = new Date();
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
</script>

{#if value instanceof Date}
	<label class="label w-full">
		{#if label}<span>{label}</span><br />{/if}

		<input
			type="date"
			value={`${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`}
			on:input={(e) => (value = new Date(e.currentTarget.value))}
			aria-invalid={errors ? 'true' : undefined}
			{...constraints}
			{...$$restProps}
			class="input {$$props.class}"
		/>
	</label>
	{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
			>{#each errors as err}
				<p class="">{err}</p>
			{/each}</span
		>{/if}
{/if}
