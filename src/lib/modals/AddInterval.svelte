<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { PlusSquare } from 'lucide-svelte';
	import { onDestroy, onMount, type SvelteComponent } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { ActivityType } from '@prisma/client';
	// import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { IntervalSchema, type training_session_schema } from '$lib/schemas';
	import { page } from '$app/stores';
	import { superForm, type Infer, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import type { WorkoutInterval } from '$lib/utils/trainingsessions/types';
	import type { ItemsStore } from '$lib/utils/dragndrop/stores';
	import { zod } from 'sveltekit-superforms/adapters';

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();

	const { items, activity_type, workoutIntervalForm } = $modal[0].meta as {
		items: ItemsStore<WorkoutInterval>;
		activity_type: ActivityType;
		workoutIntervalForm: SuperValidated<Infer<typeof IntervalSchema>>;
	};
	const superform = superForm(workoutIntervalForm, {
		id: 'NewSessionPlanForm',
		resetForm: true,
		validators: zod(IntervalSchema),
		applyAction: false,
		dataType: 'json'
	});
	const { form, errors, constraints, validateForm, enhance, delayed, reset } = superform;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

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
			{#key activity_type}
				{#if activity_type === ActivityType.SWIM}
					<AddSwimInterval {superform} user={$page.data.user} />
				{:else if activity_type === ActivityType.RUN}
					<AddRunInterval {superform} user={$page.data.user} />
				{:else if activity_type === ActivityType.BIKE}
					<AddBikeInterval {superform} user={$page.data.user} />
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
