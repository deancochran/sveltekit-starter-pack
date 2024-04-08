<script lang="ts">
	import { actionResult, superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import { training_plan_schema } from '$lib/schemas';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	export let data: PageData;

	const { form, errors, constraints, enhance, delayed, reset } = superForm(
		data.training_plan_form,
		{
			id: 'updatePlan',
			applyAction: true,
			invalidateAll: true,
			resetForm: false,
			validators: zod(training_plan_schema),
			delayMs: 0,
			timeoutMs: 8000,

			onResult({ result }) {
				if (result.type === 'success') {
					editing = false;
				}
			}
		}
	);
	let isFocused: boolean = false;
	let editing = false;

	function toggleEditing(e: CustomEvent<any>): void {
		editing = !editing;
		isFocused = !isFocused;
		if (!editing) {
			reset();
		}
	}
</script>

<div class="card">
	<form id="updatePlan" use:focusTrap={isFocused} method="POST" use:enhance>
		<header class="card-header">
			<TextInput
				disabled={!editing}
				name="name"
				label="Name"
				bind:value={$form.name}
				errors={$errors.name}
				constraints={$constraints.name}
			/>
		</header>
		<section class="p-4">
			<TextArea
				disabled={!editing}
				name="description"
				label="Description"
				bind:value={$form.description}
				errors={$errors.description}
				constraints={$constraints.description}
			/>

			<DateInput
				disabled={!editing}
				name="start_date"
				label="Start Date"
				bind:value={$form.start_date}
				errors={$errors.start_date}
				constraints={$constraints.start_date}
			/>
			<DateInput
				disabled={!editing}
				name="end_date"
				label="End Date"
				bind:value={$form.end_date}
				errors={$errors.end_date}
				constraints={$constraints.end_date}
			/>
			<br />
			<nav class="list-nav">
				<a href={`/plans/${data.plan.id}/sessions`}>
					<h2 class="h2">View All Training Sessions</h2>
				</a>
				<ul class="p-4">
					{#each data.plan.training_sessions as training_session}
						<li>
							<a href="/sessions/{training_session.id}">
								<span class="flex-auto">{training_session.title}</span>
								<span class="flex-auto">{training_session.description}</span>
								<span class="flex-auto">{training_session.date}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</section>
		<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
			{#if !editing}
				<Button
					on:click={toggleEditing}
					shadow="shadow-md"
					color="variant-filled-primary"
					form="updatePlan"
					type="submit"
					class="btn ">Edit</Button
				>
				<Button
					formaction="?/delete"
					shadow="shadow-md"
					color="variant-filled-error"
					form="updatePlan"
					type="submit"
					class="btn ">Delete</Button
				>
			{:else}
				<Button
					on:click={toggleEditing}
					shadow="shadow-md"
					color="variant-filled-primary"
					form="updatePlan"
					type="submit"
					class="btn ">Cancel</Button
				>
				{#if $delayed}
					<LoadingIcon />
				{:else}
					<Button
						formaction="?/update"
						shadow="shadow-md"
						color="variant-filled-primary"
						form="updatePlan"
						type="submit"
						class="btn ">Update</Button
					>
				{/if}
			{/if}
		</footer>
	</form>
</div>
