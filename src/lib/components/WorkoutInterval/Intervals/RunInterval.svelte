<script lang="ts">
	import RunSpeedInput from '$lib/forms/inputs/customInputs/RunSpeedInput.svelte';
	import type { WorkoutInterval } from '$lib/utils/trainingsessions/types';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let interval: WorkoutInterval;
	export let user: User;

	export let speed: number = Math.ceil((user.run_ftp) / 5) * 5;
	$: {
		interval.intensity = (1-(speed / user.run_ftp)) + 1
	}
</script>

<RunSpeedInput name="speed" label="Speed" bind:value={speed} on:input={(e) => dispatch('input', e)}/>
