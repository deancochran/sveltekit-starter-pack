<script lang="ts">
	import { training_session_schema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import type { PageData } from './$types';
	import DistanceInput from '$lib/forms/inputs/customInputs/DistanceInput.svelte';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';
	import WorkoutPlanInput from '$lib/forms/inputs/customInputs/WorkoutPlanInput.svelte';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import { ActivityType } from '@prisma/client';

	export let data: PageData;
	const { form, errors, constraints, enhance, delayed } = superForm(data.trainingSessionSchema, {
		id: 'NewTrainingSessionForm',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(training_session_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	let isFocused: boolean = false;

</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>New Training Session</h1>
	</header>
	<section class="p-4">
		<form
			id="NewTrainingSessionForm"
			use:focusTrap={isFocused}
			method="POST"
			action="?/create"
			use:enhance
		>
			<TextInput
				name="title"
				label="Title"
				bind:value={$form.title}
				errors={$errors.title}
				constraints={$constraints.title}
			/>
			<TextArea
				name="description"
				label="Description"
				bind:value={$form.description}
				errors={$errors.description}
				constraints={$constraints.description}
			/>

			<EnumSelectInput
				enumType={ActivityType}
				name="activity_type"
				label="Activity Type"
				bind:value={$form.activity_type}
				errors={$errors.activity_type}
				constraints={$constraints.activity_type}
			/>
			<DateInput
				name="date"
				label="Date"
				bind:value={$form.date}
				errors={$errors.date}
				constraints={$constraints.date}
			/>
			<WorkoutPlanInput />
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button
				formaction="?/create"
				shadow="shadow-md"
				color="variant-filled-primary"
				form="NewTrainingSessionForm"
				type="submit"
				class="btn ">Create</Button
			>
		{/if}
	</footer>
</div>
