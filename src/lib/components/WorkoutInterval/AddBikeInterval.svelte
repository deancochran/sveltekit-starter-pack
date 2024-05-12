<script lang="ts">
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import type { WorkoutInterval } from '$lib/schemas';
	import type { Writable } from 'svelte/store';
	import type { User } from 'lucia';
	import { createEventDispatcher } from 'svelte';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';
	import BikeInterval from '$lib/components/WorkoutInterval/Intervals/BikeInterval.svelte';

	const dispatch = createEventDispatcher();

	export let user: User;
	export let plan_form: Writable<WorkoutInterval>;
	export let plan_errors: Writable<any>;
	export let plan_constraints: Writable<any>;
</script>

<div class="flex w-full flex-row flex-wrap gap-2">
	<div class="flex w-full flex-row gap-2">
		<DurationInput name="duration" label="Duration" bind:value={$plan_form.duration} />
	</div>
	<BikeInterval bind:user bind:interval={$plan_form} on:input={() => dispatch('input')} />
</div>
