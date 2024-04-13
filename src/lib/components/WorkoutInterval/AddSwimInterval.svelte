<script lang="ts">
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import type { WorkoutInterval } from '$lib/schemas';
	import { IntervalType } from '$lib/utils/trainingsessions/types';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';

	import type { Writable } from 'svelte/store';
	import BlockSwimInterval from './BlockIntervals/BlockSwimInterval.svelte';
	import RampSwimInterval from './RampIntervals/RampSwimInterval.svelte';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	import DistanceInput from '$lib/forms/inputs/customInputs/DistanceInput.svelte';

	const dispatch = createEventDispatcher();

	export let user: User;
	export let plan_form: Writable<WorkoutInterval>;
	export let plan_errors: Writable<any>;
	export let plan_constraints: Writable<any>;

	function calculateDuration(interval: WorkoutInterval) {
		let sec_p_100m: number;
		switch (interval.interval_type) {
			case IntervalType.BLOCK:
				if (interval.intensity! > 1) {
					sec_p_100m = user.swim_ftp - Math.round((interval.intensity! - 1) * user.swim_ftp);
				} else {
					sec_p_100m = user.swim_ftp + Math.round((1 - interval.intensity!) * user.swim_ftp);
				}

				return Math.round(interval.distance! * 1000 * (sec_p_100m / 100));
			case IntervalType.RAMP:
				let avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
				if (avg_intensity! > 1) {
					sec_p_100m = user.swim_ftp - Math.round((avg_intensity - 1) * user.swim_ftp);
				} else {
					sec_p_100m = user.swim_ftp + Math.round((1 - avg_intensity) * user.swim_ftp);
				}
				return Math.round(interval.distance! * 1000 * (sec_p_100m / 100));
			default:
				return 0;
		}
	}
	const onUpdate = () => {
		$plan_form.duration = calculateDuration($plan_form);
	};
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
				$plan_form.distance = 0;
				$plan_form.duration = 0;
			}}
		/>
		<DistanceInput
			selectedUnit="m"
			name="distance"
			label="Distance"
			bind:value={$plan_form.distance}
			on:input={onUpdate}
		/>
	</div>
	{#key $plan_form.interval_type}
		{#if $plan_form.interval_type === IntervalType.BLOCK}
			<BlockSwimInterval bind:user bind:interval={$plan_form} on:input={onUpdate} />
		{:else if $plan_form.interval_type === IntervalType.RAMP}
			<RampSwimInterval bind:user bind:interval={$plan_form} on:input={onUpdate} />
		{:else}
			No valid interval type input
		{/if}
	{/key}
</div>
