<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';

	export let value: number;
	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
</script>

<p>{label}</p>
<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
	<div class="input-group-shim">
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
	</div>
	<input
		class="input"
		type="number"
        step="0.1"
		bind:value
		aria-invalid={errors ? 'true' : undefined}
		{...constraints}
		{...$$restProps}
	/>
	<select>
		<!-- <option>m</option> -->
		<option>km</option>
	</select>
</div>

{#if errors}<span class="flex flex-inline space-x-2 text-error-500"
		>{#each errors as err}
			<p class="">{err}</p>
		{/each}</span
	>{/if}

