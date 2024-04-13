<script lang="ts">
	import SwimSpeedInput from '$lib/forms/inputs/customInputs/SwimSpeedInput.svelte';
	import type { BlockInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let interval: BlockInterval;
	export let user: User;

	export let speed: number = Math.ceil((user.swim_ftp) / 5) * 5;
	$: {
		interval.intensity = (1-(speed / user.swim_ftp)) + 1
	}
</script>

<SwimSpeedInput name="speed" label="Speed" bind:value={speed} on:input={(e) => dispatch('input', e)}/>
