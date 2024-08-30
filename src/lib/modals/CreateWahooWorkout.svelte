<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { trainingSession } from '$lib/drizzle/schema';
	import { WahooWorkoutTypeID } from '$lib/integrations/wahoo/types';
	import { addDays } from '$lib/utils/datetime';
	import { focusTrap, getModalStore } from '@skeletonlabs/skeleton';
	import { PlusSquare } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const createWahooWorkoutSchema = z
		.object({
			name: z.string(),
			workout_type_id: z.nativeEnum(WahooWorkoutTypeID),
			starts: z.date(),
			minutes: z.number(),
			workoutToken: z.string(),
			planId: z.number().optional(),
			workoutSummaryId: z.any().optional()
		})
		.superRefine(({ starts }, ctx) => {
			if (starts > addDays(new Date(), 6)) {
				ctx.addIssue({
					code: 'custom',
					message:
						'The workout can not be scheduled in wahoo by more than 6 days in advance.',
					path: ['starts']
				});
			}
		});
	type CreateWahooWorkoutSchema = typeof createWahooWorkoutSchema;
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();
	const meta = $modal[0].meta as {
		CreateWahooWorkForm: SuperValidated<Infer<CreateWahooWorkoutSchema>>;
		trainingSession: typeof trainingSession;
	};

	const superform = superForm(meta.CreateWahooWorkForm, {
		id: 'createWahooWorkout',
		applyAction: true,
		validators: zod(createWahooWorkoutSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result } = event;
			if (result.type == 'success') {
				modal.close();
			}
			return;
		}
	});
	const { form, errors, constraints, enhance, reset } = superform;
	let trainingSessionWahooPlanId = undefined;
	$form.planId = trainingSessionWahooPlanId;
	let isFocused: boolean = false;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}><h1>New Wahoo Workout</h1></header>
		<form
			id="createWahooWorkout"
			action={`/sessions/${meta.trainingSession.id}?/CreateWahooWorkout`}
			use:enhance
			use:focusTrap={isFocused}
			method="POST"
			class="modal-form {cForm}"
		>
			<TextInput {superform} field="name" />
			<DateInput {superform} field="starts" />

			<div class="modal-footer {parent.regionFooter}">
				<Button
					type="button"
					shadow="shadow-md"
					color="variant-filled-error"
					class="btn {parent.buttonNeutral}"
					on:click={() => {
						reset();
						parent.onClose();
					}}>Cancel</Button
				>
				<Button
					shadow="shadow-md"
					color="variant-filled-primary"
					class="btn {parent.buttonPositive}"
					type="submit"><span>Create Workout</span> <PlusSquare /></Button
				>
			</div>
		</form>
	</div>
{/if}
