<script lang="ts">
	import BikeWattsInput from '$lib/forms/inputs/customInputs/BikeWattsInput.svelte';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';
	import type { RampInterval } from '$lib/schemas';
	import type { User } from 'lucia';
	import type { Writable } from 'svelte/store';

	export let interval: RampInterval;
	export let user: User;

	export let start_watts: number =
		Math.ceil((user.bike_ftp * (interval.start_intensity ?? 0.5)) / 5) * 5;
	export let end_watts: number =
		Math.ceil((user.bike_ftp * (interval.end_intensity ?? 0.5)) / 5) * 5;

	$: {
		interval.start_intensity = start_watts / user.bike_ftp;
		interval.end_intensity = end_watts / user.bike_ftp;
	}
</script>

<BikeWattsInput name="start_watts" label="Start Watts" bind:value={start_watts} />
<BikeWattsInput name="end_watts" label="End Watts" bind:value={end_watts} />
