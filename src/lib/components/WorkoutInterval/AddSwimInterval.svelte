<script lang="ts">
	import type { WorkoutInterval } from '$lib/schemas';
	import type { Writable } from 'svelte/store';
	import SwimInterval from './Intervals/SwimInterval.svelte';
	import type { User } from 'lucia';
	import DistanceInput from '$lib/forms/inputs/customInputs/DistanceInput.svelte';

	export let user: User;
	export let plan_form: Writable<WorkoutInterval>;
	export let plan_errors: Writable<any>;
	export let plan_constraints: Writable<any>;

	$plan_form.distance = 0;

	function calculateDuration(interval: WorkoutInterval) {
		let sec_p_100m: number;
		if (interval.intensity > 1) {
			sec_p_100m = user.swim_ftp - Math.round((interval.intensity - 1) * user.swim_ftp);
		} else {
			sec_p_100m = user.swim_ftp + Math.round((1 - interval.intensity) * user.swim_ftp);
		}
		return Math.round($plan_form.distance! * (sec_p_100m / 100));
	}
	const onUpdate = () => {
		$plan_form.duration = calculateDuration($plan_form);
	};
</script>

<div class="flex w-full flex-row flex-wrap gap-2">
	<div class="flex w-full flex-row gap-2">
		<DistanceInput
			name="distance"
			label="Distance"
			bind:value={$plan_form.distance}
			on:input={onUpdate}
		/>
	</div>
	<SwimInterval bind:user bind:interval={$plan_form} on:input={onUpdate} />
</div>
