<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { PlusSquare } from 'lucide-svelte';
	import { type SvelteComponent } from 'svelte';
	// import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';
	import NumberInput from '$lib/forms/inputs/NumberInput.svelte';
	import RangeInput from '$lib/forms/inputs/RangeInput.svelte';
	import type { ItemsStore } from '$lib/utils/dragndrop/stores';
	import {
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const IntervalSchema = z.object({
		duration: z.number().min(0).nonnegative(),
		intensity: z.number().min(0).nonnegative(),
		distance: z.number().min(0).nonnegative().optional(),
		power: z.number().min(0).nonnegative().optional(),
		hr: z.number().min(0).nonnegative().optional()
	});
	type Interval = z.infer<typeof IntervalSchema>;
	type WorkoutInterval = z.infer<typeof IntervalSchema>;
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();

	const { items, activityType, workoutIntervalForm } = $modal[0].meta as {
		items: ItemsStore<WorkoutInterval>;
		activityType: 'BIKE' | 'SWIM' | 'RUN';
		workoutIntervalForm: SuperValidated<Infer<typeof IntervalSchema>>;
	};
	const superform = superForm(workoutIntervalForm, {
		id: 'NewSessionPlanForm',
		resetForm: true,
		validators: zod(IntervalSchema),
		applyAction: false,
		dataType: 'json'
	});
	const { form, errors, constraints, validateForm, enhance, delayed, reset } =
		superform;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';

	async function formSubmitHandler(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		const res = await validateForm();
		if (res.valid) {
			if ($modal[0].response) $modal[0].response($form);
			modal.close();
		}
	}
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}><h1>Add Interval</h1></header>
		<form
			id="NewSessionPlanForm"
			on:submit|preventDefault={formSubmitHandler}
			class="modal-form {cForm}"
		>
			{#key activityType}
				{#if activityType === 'SWIM'}
					<InputLabel label="Distance">
						<NumberInput {superform} field="distance" />
					</InputLabel>

					<InputLabel label="Duration">
						<RangeInput {superform} field="duration" />
					</InputLabel>
				{:else if activityType === 'RUN'}
					<InputLabel label="Distance">
						<NumberInput {superform} field="distance" />
					</InputLabel>

					<InputLabel label="Duration">
						<RangeInput {superform} field="duration" />
					</InputLabel>
				{:else if activityType === 'BIKE'}
					<InputLabel label="Distance">
						<NumberInput {superform} field="distance" />
					</InputLabel>

					<InputLabel label="Duration">
						<RangeInput {superform} field="duration" />
					</InputLabel>
				{:else}
					<p>No activity type found</p>
				{/if}
			{/key}

			<div class="modal-footer {parent.regionFooter}">
				<Button
					type="button"
					shadow="shadow-md"
					color="variant-filled-primary"
					class="btn {parent.buttonNeutral}"
					on:click={() => {
						reset();
						parent.onClose();
					}}>{parent.buttonTextCancel}</Button
				>
				<Button
					shadow="shadow-md"
					color="variant-filled-primary"
					class="btn {parent.buttonPositive}"
					type="submit"><span>Add Interval</span> <PlusSquare /></Button
				>
			</div>
		</form>
	</div>
{/if}
