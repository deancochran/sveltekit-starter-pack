<script lang="ts" context="module">
	type T = Record<string, unknown>;
</script>

<script lang="ts">
	import { type SuperForm } from 'sveltekit-superforms';
	import type { WorkoutInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import RangeInput from '$lib/forms/inputs/RangeInput.svelte';
	import NumberInput from '$lib/forms/inputs/NumberInput.svelte';
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';

	export let user: User;
	export let superform: SuperForm<WorkoutInterval>;

	let { form } = superform;

	function calculateDuration(interval: WorkoutInterval) {
		let sec_p_100m: number;
		if (interval.intensity > 1) {
			sec_p_100m = user.swim_ftp - Math.round((interval.intensity - 1) * user.swim_ftp);
		} else {
			sec_p_100m = user.swim_ftp + Math.round((1 - interval.intensity) * user.swim_ftp);
		}
		return Math.round($form.distance! * (sec_p_100m / 100));
	}

	$form.distance = 0;
	const onUpdate = () => {
		$form.duration = calculateDuration($form);
	};

	let speed = Math.ceil(user.swim_ftp / 5) * 5;
	$: {
		$form.intensity = 1 - speed / user.swim_ftp + 1;
	}

	$: swim_ftp_display = `${Math.floor(speed / 60)
		.toString()
		.padStart(2, '0')}:${(speed % 60).toFixed(0).padStart(2, '0')}`;

	$: label_display = 'Speed: ' + swim_ftp_display + '/100m';
</script>

<div class="flex w-full flex-row flex-wrap gap-2">
	<InputLabel label="Distance">
		<NumberInput
			{superform}
			field="distance"
			bind:value={$form.distance}
			on:input={onUpdate}
			step={'25'}
			min="0"
			{...$$restProps}
		/></InputLabel
	>
	<InputLabel bind:label={label_display}>
		<RangeInput {superform} field="duration" on:input={onUpdate} />
	</InputLabel>
</div>
