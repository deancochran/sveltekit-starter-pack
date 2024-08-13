<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { generateId } from 'lucia';
	import { superValidate, type Infer } from 'sveltekit-superforms';
	import { create_wahoo_workout_schema, type CreateWahooWorkoutSchema } from '$lib/schemas';
	import { getModalStore, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getWahooWorkoutIdFromTrainingSessionType } from '$lib/utils/integrations/wahoo/utils';
	import { ThirdPartyIntegrationProvider } from '@prisma/client';
	import { invalidateAll } from '$app/navigation';
	import { Pencil } from 'lucide-svelte';
	import TrainingSessionZoneDistribution from '$lib/components/WorkoutIntervals/TrainingSessionZoneDistribution.svelte';
	import TrainingSessionPlanIntervals from '$lib/components/WorkoutIntervals/TrainingSessionPlanIntervals.svelte';

	export let data: PageData;
	let modal = getModalStore();
	let toastStore = getToastStore();

	// Init modal
	async function triggerCreateWahooWorkoutModal() {
		if (!data.club_event.training_session) {
			let t: ToastSettings = {
				message: 'No Training Session Available',
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);
		}
		const init_data: Infer<CreateWahooWorkoutSchema> = {
			name: data.club_event.training_session!.title,
			workout_type_id: getWahooWorkoutIdFromTrainingSessionType(
				data.club_event.training_session!.activity_type
			),
			starts: new Date(),
			minutes: data.club_event.training_session!.duration ?? 0,
			workout_token: generateId(50)
		};
		const CreateWahooWorkForm = await superValidate(init_data, zod(create_wahoo_workout_schema));

		modal.trigger({
			type: 'component',
			component: 'CreateWahooWorkout',
			meta: {
				CreateWahooWorkForm,
				training_session: data.club_event.training_session
			}
		});
	}
	async function triggerUpdateClubEvent() {
		modal.trigger({
			type: 'component',
			component: 'UpdateClubEvent',
			meta: {
				form: data.update_club_event_form
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
			<h1 class="h1 -mx-1">{data.club_event.name}</h1>
			<h4 class="h5">{data.club.name}</h4>
		</div>
		<div>
			{#if data.user_membership?.admin}
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
			{data.club_event.date.toLocaleDateString()}
		</p>
		<br />
		<h4 class="h4">Description</h4>
		<p>
			{data.club_event.description}
		</p>
		<br />
		<h4 class="h4">Training Session</h4>
		{#if data.club_event.training_session}
			<section class="p-4 flex flex-col"></section>
			<TrainingSessionZoneDistribution training_session={data.club_event.training_session} />
			<TrainingSessionPlanIntervals training_session={data.club_event.training_session} />
		{:else}
			<span>No Attached Training Session</span>
		{/if}
	</div>
	<div class="card-footer">
		{#if data.user_integrations.find((e) => e.provider == ThirdPartyIntegrationProvider.WAHOO)}
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
