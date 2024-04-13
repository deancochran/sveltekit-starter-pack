<script lang="ts">
	import { convertSecondsToTimeDisplay, secondsToHHMMSS } from '$lib/utils/datetime';
	import { Clock, Route } from 'lucide-svelte';
	import type { InputConstraint } from 'sveltekit-superforms';

	// the number of seconds
	export let name: string;

	export let label: string | undefined = undefined;
	export let errors: string[] | undefined = undefined;
	export let constraints: InputConstraint | undefined = undefined;
	export let value: number;
	if (!value) value = 0;
	let hours = Math.floor(value / 3600);
	let mins = Math.floor((value % 3600) / 60);
	let secs = value % 60;

	$: {
		value = hours * 3600 + mins * 60 + secs;
	}
	$: display_value = secondsToHHMMSS(value);
</script>

<label class="label w-full flex flex-col">
	{#if label}<span>{label}: {display_value}</span>{/if}
	<fieldset
		{name}
		class="input-group flex w-full flex-row input-group-divider grid-cols-[auto_1fr_auto]"
		disabled={$$props.disabled}
	>
		<div class="input-group-shim !p-2" class:opacity-50={$$props.disabled}>
			<Clock />
		</div>
		<input
			disabled={$$props.disabled}
			bind:value={hours}
			class="w-full px-1 mx-0 input rounded-none"
			type="number"
			name="hour"
			min="0"
			max="23"
		/>
		<input
			disabled={$$props.disabled}
			bind:value={mins}
			class="w-full px-1 mx-0 input rounded-none"
			type="number"
			name="minute"
			min="0"
			max="59"
		/>
		<input
			disabled={$$props.disabled}
			bind:value={secs}
			class="w-full px-1 mx-0 input rounded-none"
			type="number"
			name="second"
			min="0"
			max="59"
		/>
	</fieldset>
	{#if errors}<span class="flex flex-wrap space-x-2 text-error-500"
			>{#each errors as err}
				<p class="">{err}</p>
			{/each}</span
		>{/if}
</label>
