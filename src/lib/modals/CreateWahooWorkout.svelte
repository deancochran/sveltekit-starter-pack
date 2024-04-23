<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { create_wahoo_workout_schema, type CreateWahooWorkoutSchema } from '$lib/schemas';
	import {
		ThirdPartyIntegrationProvider,
		type thirdPartyIntegrationTrainingSession,
		type trainingSession
	} from '@prisma/client';
	import { focusTrap, getModalStore } from '@skeletonlabs/skeleton';
	import { PlusSquare } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();
	const meta = $modal[0].meta as {
		CreateWahooWorkForm: SuperValidated<Infer<CreateWahooWorkoutSchema>>;
		training_session: trainingSession & {
			third_party_training_sessions: thirdPartyIntegrationTrainingSession[];
		};
	};

	const { form, errors, constraints, enhance, delayed, reset } = superForm(
		meta.CreateWahooWorkForm,
		{
			id: 'createWahooWorkout',
			applyAction: true,
			validators: zod(create_wahoo_workout_schema),
			delayMs: 0,
			timeoutMs: 8000,
			dataType: 'json',
			onResult(event) {
				const { result } = event;
				if (result.type == 'success') {
					modal.close();
				}
				return;
			}
		}
	);
	let training_session_wahoo_plan_id = undefined;
	if (meta.training_session.third_party_training_sessions.length > 0) {
		const sessions = meta.training_session.third_party_training_sessions.filter(
			(ts) => ts.provider == ThirdPartyIntegrationProvider.WAHOO
		);
		training_session_wahoo_plan_id =
			sessions.length > 0 ? sessions[0].provider_training_session_id : undefined;
	}
	$form.workout_token = meta.training_session.uuid;
	$form.plan_id = training_session_wahoo_plan_id;
	let isFocused: boolean = false;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<SuperDebug data={$form} />
		<header class={cHeader}><h1>New Wahoo Workout</h1></header>
		<form
			id="createWahooWorkout"
			action="?/CreateWahooWorkout"
			use:enhance
			use:focusTrap={isFocused}
			method="POST"
			class="modal-form {cForm}"
		>
			<TextInput
				name="name"
				label="Workout Name"
				bind:value={$form.name}
				errors={$errors.name}
				constraints={$constraints.name}
			/>
			<DateInput
				name="starts"
				label="Workout Date"
				bind:value={$form.starts}
				errors={$errors.starts}
				constraints={$constraints.starts}
			/>

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
