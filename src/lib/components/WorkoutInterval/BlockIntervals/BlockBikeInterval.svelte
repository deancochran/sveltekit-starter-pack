<script lang="ts">
	import BikeWattsInput from '$lib/forms/inputs/customInputs/BikeWattsInput.svelte';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';
	import type { BlockInterval } from '$lib/schemas';
	import type { User } from 'lucia';

	export let interval: BlockInterval;
	export let user: User;

	export let watts: number = Math.ceil((user.bike_ftp * (interval.intensity ?? 0.5)) / 5) * 5;

	$: {
		interval.intensity = watts / user.bike_ftp;
	}
</script>

<BikeWattsInput name="watts" label="Watts" bind:value={watts} />
