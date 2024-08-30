<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import TrainingSessionPlanIntervals from '$lib/components/WorkoutIntervals/TrainingSessionPlanIntervals.svelte';
	import TrainingSessionZoneDistribution from '$lib/components/WorkoutIntervals/TrainingSessionZoneDistribution.svelte';
	import {
		createWahooWorkoutSchema,
		type CreateWahooWorkoutSchema
	} from '$lib/schemas';
	import { getWahooWorkoutIdFromTrainingSessionType } from '$lib/integrations/wahoo/utils';
	import {
		getModalStore,
		getToastStore,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import { generateId } from 'lucia';
	import { Pencil } from 'lucide-svelte';
	import { superValidate, type Infer } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';

	export let data: PageData;
	let modal = getModalStore();
	let toastStore = getToastStore();

	// Init modal
	async function triggerCreateWahooWorkoutModal() {
		if (!data.clubEvent.trainingSession) {
			let t: ToastSettings = {
				message: 'No Training Session Available',
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);
		}
		const init_data: Infer<CreateWahooWorkoutSchema> = {
			name: data.clubEvent.trainingSession!.title,
			workout_type_id: getWahooWorkoutIdFromTrainingSessionType(
				data.clubEvent.trainingSession!.activityType
			),
			starts: new Date(),
			minutes: data.clubEvent.trainingSession!.duration ?? 0,
			workoutToken: generateId(50)
		};
		const CreateWahooWorkForm = await superValidate(
			init_data,
			zod(createWahooWorkoutSchema)
		);

		modal.trigger({
			type: 'component',
			component: 'CreateWahooWorkout',
			meta: {
				CreateWahooWorkForm,
				trainingSession: data.clubEvent.trainingSession
			}
		});
	}
	async function triggerUpdateClubEvent() {
		modal.trigger({
			type: 'component',
			component: 'UpdateClubEvent',
			meta: {
				form: data.updateClubEventForm
			},
			response: async (res) => {
				await invalidateAll();
			}
		});
	}
</script>

<!-- Event MetaData (editable for admins) -->
<div class="card">
	<div class="card-header flex flex-row justify-between">
		<div>
			<h1 class="h1 -mx-1">{data.clubEvent.name}</h1>
			<h4 class="h5">{data.club.name}</h4>
		</div>
		<div>
			{#if data.userMembership?.admin}
				<Button
					color="variant-filled-primary"
					label="Update Event"
					type="btn"
					shadow="shadow-md"
					class="btn-icon"
					on:click={triggerUpdateClubEvent}><Pencil /></Button
				>
			{/if}
		</div>
	</div>
	<div class="p-4">
		<h4 class="h4">Date</h4>
		<p>
			{data.clubEvent.date.toLocaleDateString()}
		</p>
		<br />
		<h4 class="h4">Description</h4>
		<p>
			{data.clubEvent.description}
		</p>
		<br />
		<h4 class="h4">Training Session</h4>
		{#if data.clubEvent.trainingSession}
			<section class="p-4 flex flex-col"></section>
			<TrainingSessionZoneDistribution
				_trainingSession={data.clubEvent.trainingSession}
			/>
			<TrainingSessionPlanIntervals
				_trainingSession={data.clubEvent.trainingSession}
			/>
		{:else}
			<span>No Attached Training Session</span>
		{/if}
	</div>
	<div class="card-footer">
		{#if data.userIntegrations.find((e) => e.provider == 'WAHOO')}
			<Button
				shadow="shadow-md"
				color="variant-filled-tertiary"
				type="button"
				on:click={triggerCreateWahooWorkoutModal}
				class="btn ">Create Wahoo Workout</Button
			>
		{/if}
	</div>
</div>
