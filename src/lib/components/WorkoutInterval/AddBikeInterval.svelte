<script lang="ts">
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';
	import RangeInput from '$lib/forms/inputs/RangeInput.svelte';

	import { type SuperForm } from 'sveltekit-superforms';

	import type { WorkoutInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';

	export let superform: SuperForm<WorkoutInterval>;
	const { form } = superform;
	export let user: User;
	const onUpdate = () => {
		$form.intensity = $form.power ?? 1 / user.bike_ftp;
	};
</script>

<div class="flex w-full flex-row flex-wrap gap-2">
	<h1>intensity: {$form.intensity}% watts: {$form.power}w</h1>
	<div class="flex w-full flex-row gap-2">
		<InputLabel label="Duration">
			<DurationInput {superform} field="duration" />
		</InputLabel>
	</div>
	<InputLabel label="Watts">
		<RangeInput {superform} field="power" on:input={onUpdate} />
	</InputLabel>
</div>
