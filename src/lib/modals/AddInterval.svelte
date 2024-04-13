<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { PlusSquare } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { ActivityType } from '@prisma/client';
	// import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { WorkoutInterval } from '$lib/schemas';
	import type { Writable } from 'svelte/store';
	import AddBikeInterval from '$lib/components/WorkoutInterval/AddBikeInterval.svelte';
	import { page } from '$app/stores';
	import AddRunInterval from '$lib/components/WorkoutInterval/AddRunInterval.svelte';
	import AddSwimInterval from '$lib/components/WorkoutInterval/AddSwimInterval.svelte';

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();
	const {
		form: plan_form,
		errors: plan_errors,
		constraints: plan_constraints,
		validateForm: plan_validateForm,
		reset: plan_reset,
		activity_type
	} = $modal[0].meta as {
		form: Writable<WorkoutInterval>;
		errors: any;
		constraints: any;
		validateForm: any;
		reset: any;
		activity_type: ActivityType;
	};
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	async function onFormSubmit(): Promise<void> {
		const res = await plan_validateForm();
		if (res.valid) {
			if ($modal[0].response) $modal[0].response($plan_form);
			modal.close();
		}
		console.log(res);
	}
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}><h1>Add Interval</h1></header>
		<form
			id="NewSessionPlanForm"
			on:submit|preventDefault={onFormSubmit}
			class="modal-form {cForm}"
		>
			{#key activity_type}
				{#if activity_type === ActivityType.SWIM}
					<AddSwimInterval
						user={$page.data.user}
						{plan_form}
						{plan_errors}
						{plan_constraints}
						on:reset={() => {
							plan_reset();
						}}
					/>
				{:else if activity_type === ActivityType.RUN}
					<AddRunInterval
						user={$page.data.user}
						{plan_form}
						{plan_errors}
						{plan_constraints}
						on:reset={() => {
							plan_reset();
						}}
					/>
				{:else if activity_type === ActivityType.BIKE}
					<AddBikeInterval
						user={$page.data.user}
						{plan_form}
						{plan_errors}
						{plan_constraints}
						on:reset={() => {
							plan_reset();
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
						plan_reset();
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
