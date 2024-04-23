<script lang="ts">
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import type { WorkoutInterval } from '$lib/schemas';
	import { IntervalType } from '$lib/utils/trainingsessions/types';
	import type { Writable } from 'svelte/store';
	import RampBikeInterval from './RampIntervals/RampBikeInterval.svelte';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';

	const dispatch = createEventDispatcher();

	export let user: User;
	export let plan_form: Writable<WorkoutInterval>;
	export let plan_errors: Writable<any>;
	export let plan_constraints: Writable<any>;
</script>

<div class="flex w-full flex-row flex-wrap gap-2">
	<div class="flex w-full flex-row gap-2">
		<EnumSelectInput
			enumType={IntervalType}
			name="interval_type"
			label="Interval Type"
			bind:value={$plan_form.interval_type}
			errors={$plan_errors.interval_type}
			constraints={$plan_constraints.interval_type}
			on:change={(e) => {
				dispatch('reset');
				$plan_form.interval_type = e.detail.currentTarget.value;
			}}
		/>
		<DurationInput name="duration" label="Duration" bind:value={$plan_form.duration} />
	</div>
	{#key $plan_form.interval_type}
		{#if $plan_form.interval_type === IntervalType.RAMP}
			<RampBikeInterval bind:user bind:interval={$plan_form} />
		{:else}
			No valid interval type input
		{/if}
	{/key}
</div>
