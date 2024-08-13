<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import {
		RecurrenceFrequency,
		new_club_event_schema,
		type NewClubEventSchema
	} from '$lib/schemas';
	import { SlideToggle, focusTrap, getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	import DateInput from './inputs/DateInput.svelte';
	import TextInput from './inputs/TextInput.svelte';
	import TextArea from './inputs/TextArea.svelte';
	import EnumSelectInput from './inputs/EnumSelectInput.svelte';
	import { PlusSquare } from 'lucide-svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { invalidateAll } from '$app/navigation';
	import InputLabel from './inputs/InputLabel.svelte';

	export let parent: SvelteComponent;
	const modal = getModalStore();
	const meta = $modal[0].meta as {
		form: SuperValidated<Infer<NewClubEventSchema>>;
	};

	const superform = superForm(meta.form, {
		id: 'CreateClubEvent',
		validators: zod(new_club_event_schema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async (event) => {
			const { result } = event;
			if (result.type == 'success') {
				reset();
				if ($modal[0].response) $modal[0].response($form);
				modal.close();
			}
		}
	});
	const { form, errors, constraints, enhance, reset, delayed } = superform;
	let isFocused: boolean = false;

	$: series_config_disable = $form.recurring == false;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modal[0]}
	<div class="modal-example-form {cBase}">
		<SuperDebug data={$form} />
		<header class={cHeader}><h1>New Club Event</h1></header>
		<form
			name="CreateClubEvent"
			id="CreateClubEvent"
			action="?/CreateClubEvent"
			use:enhance
			use:focusTrap={isFocused}
			method="POST"
			class="modal-form {cForm}"
		>
			<InputLabel label="date">
				<DateInput {superform} field="date" />
			</InputLabel>

			<InputLabel label="name">
				<TextInput {superform} field="name" />
			</InputLabel>

			<InputLabel label="description">
				<TextArea {superform} field="description" />
			</InputLabel>

			<SlideToggle name="recurring" bind:checked={$form.recurring}>Recurring Event</SlideToggle>
			<InputLabel label="frequency">
				<EnumSelectInput
					enumType={RecurrenceFrequency}
					field="frequency"
					{superform}
					bind:disabled={series_config_disable}
				/>
			</InputLabel>
			<InputLabel label="end_date">
				<DateInput {superform} field="end_date" bind:disabled={series_config_disable} />
			</InputLabel>
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
				{#if $delayed}
					<LoadingIcon />
				{:else}
					<Button
						shadow="shadow-md"
						color="variant-filled-primary"
						class="btn {parent.buttonPositive}"
						type="submit"><span>Create Event</span> <PlusSquare /></Button
					>
				{/if}
			</div>
		</form>
	</div>
{/if}
