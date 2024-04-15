<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { PlusSquare } from 'lucide-svelte';
	import { onDestroy, onMount, type SvelteComponent } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { ActivityType } from '@prisma/client';
	// import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { workout_interval_schema, type training_session_schema } from '$lib/schemas';
	import AddBikeInterval from '$lib/components/WorkoutInterval/AddBikeInterval.svelte';
	import { page } from '$app/stores';
	import AddRunInterval from '$lib/components/WorkoutInterval/AddRunInterval.svelte';
	import AddSwimInterval from '$lib/components/WorkoutInterval/AddSwimInterval.svelte';
	import { type Infer, type SuperForm } from 'sveltekit-superforms';

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();

	const { form, errors, constraints, reset, validateForm, activity_type } = $modal[0].meta as {
		activity_type: ActivityType;
		form: SuperForm<Infer<typeof workout_interval_schema>>['form'];
		errors: SuperForm<Infer<typeof workout_interval_schema>>['errors'];
		constraints: SuperForm<Infer<typeof workout_interval_schema>>['constraints'];
		reset: SuperForm<Infer<typeof workout_interval_schema>>['reset'];
		validateForm: SuperForm<Infer<typeof workout_interval_schema>>['validateForm'];
	};

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

	// onDestroy(() => {
	// 	if ($modal[0].response) $modal[0].response(null);
	// 	modal.close();
	// });
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
					<AddSwimInterval
						user={$page.data.user}
						plan_form={form}
						plan_errors={errors}
						plan_constraints={constraints}
						on:reset={() => {
							reset();
						}}
					/>
				{:else if activity_type === ActivityType.RUN}
					<AddRunInterval
						user={$page.data.user}
						plan_form={form}
						plan_errors={errors}
						plan_constraints={constraints}
						on:reset={() => {
							reset();
						}}
					/>
				{:else if activity_type === ActivityType.BIKE}
					<AddBikeInterval
						user={$page.data.user}
						plan_form={form}
						plan_errors={errors}
						plan_constraints={constraints}
						on:reset={() => {
							reset();
						}}
					/>
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
