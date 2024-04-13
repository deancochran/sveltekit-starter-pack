<script lang="ts">
	import SwimSpeedInput from '$lib/forms/inputs/customInputs/SwimSpeedInput.svelte';
	import type { RampInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let interval: RampInterval;
	export let user: User;

	export let start_speed = Math.ceil((user.swim_ftp) / 5) * 5; 
	export let end_speed: number = start_speed

	$: {
		interval.start_intensity = (1-(start_speed / user.swim_ftp)) + 1
		interval.end_intensity = (1-(end_speed / user.swim_ftp)) + 1
	}
</script>

<SwimSpeedInput name="start_speed" label="Start Speed" bind:value={start_speed} on:input={(e) => dispatch('input', e)}/>
<SwimSpeedInput name="end_speed" label="End Speed" bind:value={end_speed} on:input={(e) => dispatch('input', e)}/>
