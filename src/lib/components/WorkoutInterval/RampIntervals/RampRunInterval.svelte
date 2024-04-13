<script lang="ts">
	import RunSpeedInput from '$lib/forms/inputs/customInputs/RunSpeedInput.svelte';
	import type { RampInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let interval: RampInterval;
	export let user: User;

	export let start_speed: number = Math.ceil(user.run_ftp / 5) * 5;
	export let end_speed: number = start_speed;

	$: {
		interval.start_intensity = (1 - (start_speed / user.run_ftp)) + 1;
		interval.end_intensity = (1 - (end_speed / user.run_ftp)) + 1;
	}
</script>

<RunSpeedInput
	name="start_speed"
	label="Start Speed"
	bind:value={start_speed}
	on:input={(e) => dispatch('input', e)}
/>
<RunSpeedInput
	name="end_speed"
	label="End Speed"
	bind:value={end_speed}
	on:input={(e) => dispatch('input', e)}
/>
