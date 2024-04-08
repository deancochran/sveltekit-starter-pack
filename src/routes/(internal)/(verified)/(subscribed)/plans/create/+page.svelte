<script lang="ts">
	import { training_plan_schema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, constraints, enhance, delayed } = superForm(data.trainingPlanSchema, {
		id: 'NewTrainingPlanForm',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(training_plan_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>New Training Plan</h1>
	</header>
	<section class="p-4">
		<form
			id="NewTrainingPlanForm"
			use:focusTrap={isFocused}
			method="POST"
			action="?/create"
			use:enhance
		>
			<TextInput
				name="name"
				label="Name"
				bind:value={$form.name}
				errors={$errors.name}
				constraints={$constraints.name}
			/>
			<TextArea
				name="description"
				label="Description"
				bind:value={$form.description}
				errors={$errors.description}
				constraints={$constraints.description}
			/>
			<DateInput
				name="start_date"
				label="Start Date"
				bind:value={$form.start_date}
				errors={$errors.start_date}
				constraints={$constraints.start_date}
			/>
			<DateInput
				name="end_date"
				label="End Date"
				bind:value={$form.end_date}
				errors={$errors.end_date}
				constraints={$constraints.end_date}
			/>
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
				form="NewTrainingPlanForm"
				type="submit"
				class="btn ">Create</Button
			>
		{/if}
	</footer>
</div>
