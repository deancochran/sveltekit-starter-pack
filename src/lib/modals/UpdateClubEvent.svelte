<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import NumberInput from '$lib/forms/inputs/NumberInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { focusTrap, getModalStore } from '@skeletonlabs/skeleton';
	import dayjs from 'dayjs';
	import { CircleAlertIcon } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	enum RecurrenceFrequency {
		DAILY = 'DAILY',
		WEEKLY = 'WEEKLY',
		BIWEEKLY = 'BIWEEKLY',
		MONTHLY = 'MONTHLY'
	}

	const newClubEventSchema = z
		.object({
			trainingSessionId: z.number().optional(),
			date: z.date(),
			name: z.string().max(50, 'Must be at most 50 characters long'),
			description: z.string().max(200, 'Must be at most 200 characters long'),
			recurring: z.boolean().default(false),
			endDate: z.date().default(new Date()),
			frequency: z
				.nativeEnum(RecurrenceFrequency)
				.default(RecurrenceFrequency.WEEKLY)
		})
		.superRefine(({ date, endDate, recurring }, ctx) => {
			if (date <= dayjs().add(-1, 'day').startOf('day').toDate()) {
				ctx.addIssue({
					code: 'custom',
					message: 'The Date Cannot be before today.',
					path: ['date']
				});
			}
			if (endDate < date && recurring) {
				ctx.addIssue({
					code: 'custom',
					message: 'The End Date Cannot be Before the Start Date.',
					path: ['endDate']
				});
			}
		});

	type NewClubEventSchema = typeof newClubEventSchema;

	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modal = getModalStore();
	const meta = $modal[0].meta as {
		form: SuperValidated<Infer<NewClubEventSchema>>;
	};

	const superform = superForm(meta.form, {
		id: 'UpdateClubEvent',
		applyAction: true,
		validators: zod(newClubEventSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result } = event;
			if (result.type == 'success') {
				modal.close();
			}
			return;
		}
	});
	const { enhance, reset, delayed } = superform;
	let isFocused: boolean = false;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm =
		'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}><h1>New Wahoo Workout</h1></header>
		<form
			id="UpdateClubEvent"
			action="?/UpdateClubEvent"
			use:enhance
			use:focusTrap={isFocused}
			method="POST"
			class="modal-form {cForm}"
		>
			<DateInput field="date" {superform} />

			<TextInput field="name" {superform} />
			<TextArea field="description" {superform} />
			<aside class="alert variant-ghost">
				<!-- Icon -->
				<div><CircleAlertIcon /></div>
				<!-- Message -->
				<div class="alert-message">
					<h3 class="h3">Attaching a Training Session</h3>
					<p>
						Paste the Training Session's unique id number here to add the
						training session
					</p>
				</div>
				<!-- Actions -->
				<div class="alert-actions">
					<Link
						color="variant-soft-secondary"
						label="Your Training Sessions"
						target="_blank"
						href="/sessions">See your Sessions</Link
					>
				</div>
			</aside>
			<NumberInput {superform} field="trainingSessionId" />

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
						type="submit">Update Event</Button
					>
				{/if}
			</div>
		</form>
	</div>
{/if}
