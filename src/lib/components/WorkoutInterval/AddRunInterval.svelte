<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import RangeInput from '$lib/forms/inputs/RangeInput.svelte';

	import { type SuperForm } from 'sveltekit-superforms';

	import RunInterval from './Intervals/RunInterval.svelte';

	import DistanceInput from '$lib/forms/inputs/customInputs/DistanceInput.svelte';
	import type { WorkoutInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';

	export let superform: SuperForm<WorkoutInterval>;
	export let user: User;

	const { form } = superform;

	function calculateDuration(interval: WorkoutInterval) {
		let sec_p_km: number;
		if (interval.intensity > 1) {
			sec_p_km = user.run_ftp - Math.round((interval.intensity - 1) * user.run_ftp);
		} else {
			sec_p_km = user.run_ftp + Math.round((1 - interval.intensity) * user.run_ftp);
		}
		return Math.round(($form.distance! / 1000) * sec_p_km);
	}

	$form.distance = 0;
	const onUpdate = () => {
		$form.duration = calculateDuration($form);
	};
	$: {
		$form.intensity = 1 - $form / user.run_ftp + 1;
	}
	$: run_ftp_display = `${Math.floor(value / 60)
		.toString()
		.padStart(2, '0')}:${(value % 60).toFixed(0).padStart(2, '0')}`;
	$: label_display = `$Duration: ${run_ftp_display}/km`;
</script>

<div class="flex w-full flex-row flex-wrap gap-2">
	<div class="flex w-full flex-row gap-2">
		<DistanceInput
			name="distance"
			label="Distance"
			bind:value={$form.distance}
			on:input={onUpdate}
		/>
	</div>

	<InputLabel bind:label={label_display}>
		<RangeInput {superform} field="duration" on:input={onUpdate} />
	</InputLabel>
</div>
