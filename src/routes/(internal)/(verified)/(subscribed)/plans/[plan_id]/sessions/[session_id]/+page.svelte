<script lang="ts">
	import { superForm, superValidate } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { focusTrap, getModalStore, popup } from '@skeletonlabs/skeleton';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import IntervalCard from '$lib/components/WorkoutInterval/IntervalCard.svelte';
	import { ActivityType } from '@prisma/client';
	import {
		IntervalSchema,
		create_wahoo_workout_schema,
		training_session_schema,
		type CreateWahooWorkoutSchema,
		type WorkoutInterval
	} from '$lib/schemas';
	import { type ItemsStore, ItemsStoreService } from '$lib/utils/dragndrop/stores';
	import { WorkoutIntervalService } from '$lib/utils/trainingsessions/stores';
	import {
		calculateAvgWatts,
		calculateDistance,
		evaluatePlanTss,
		getIntervalDisplay
	} from '$lib/utils/trainingsessions/types';
	import { CopyIcon, PlusSquare, TrashIcon, Undo2 } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { get } from 'svelte/store';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import { getWahooWorkoutIdFromTrainingSessionType } from '$lib/utils/integrations/wahoo/utils';
	import WorkoutIntervals from '$lib/components/WorkoutIntervals/WorkoutIntervals.svelte';
	import ZoneDistribution from '$lib/components/WorkoutIntervals/ZoneDistribution.svelte';
	import { page } from '$app/stores';
	import { getIntensityColor } from '$lib/components/WorkoutIntervals/types';

	// Get page data
	export let data: PageData;

	// Init modal
	let modal = getModalStore();
	// AddInterval Modal
	async function triggerAddIntervalModal() {
		const workoutIntervalForm = await superValidate(zod(IntervalSchema));
		modal.trigger({
			type: 'component',
			component: 'AddInterval',
			meta: {
				workoutIntervalForm,
				items,
				activity_type: $form.activity_type
			},
			response: (r: WorkoutInterval) => {
				if (r) {
					// $items = [...$items, { id: $items.length + 1, data: r }];
					const new_item = { id: $items.length + 1, data: r };
					items.update((curr) => [...curr, new_item]);
				}
			}
		});
	}

	// Init form
	let isFocused: boolean = false;
	const { form, errors, constraints, enhance, delayed, reset } = superForm(
		data.training_session_form,
		{
			id: 'update',
			resetForm: true,
			validators: zod(training_session_schema),
			delayMs: 0,
			timeoutMs: 8000,
			dataType: 'json',
			onResult: (e) => {
				if (e.result.type === 'success') {
					toggleEditing();
				}
			}
		}
	);

	// Init edit mode
	$: editing = false;
	function toggleEditing(): void {
		editing = !editing;
		isFocused = !isFocused;
		if (!editing) {
			reset();
			$items = $form.plan.map((obj, i) => ({ id: i, data: obj }));
		}
	}

	// Init drag and drop sort items
	function handleSort(e: { detail: { items: { id: number; data: WorkoutInterval }[] } }) {
		$items = e.detail.items;
	}
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>(
		$form.plan.map((obj, i) => ({ id: i, data: obj }))
	);

	items.subscribe((curr) => {
		$form.duration = curr.reduce((a, b) => a + b.data.duration, 0);
		const intervals = [...curr.map((i) => i.data)];
		$form.stress_score = evaluatePlanTss(data.user, $form.activity_type, intervals).stress_score;
		$form.plan = intervals;
	});

	$: max_intensity = $items.reduce((a, b) => Math.max(a, b.data.intensity), 0);

	// Init modal
	async function triggerCreateWahooWorkoutModal() {
		const init_data: Infer<CreateWahooWorkoutSchema> = {
			name: data.training_session.title,
			workout_type_id: getWahooWorkoutIdFromTrainingSessionType(
				data.training_session.activity_type
			),
			starts: data.training_session.date,
			minutes: data.training_session.duration ?? 0,
			workout_token: String(data.training_session.id)
		};
		const CreateWahooWorkForm = await superValidate(init_data, zod(create_wahoo_workout_schema));

		modal.trigger({
			type: 'component',
			component: 'CreateWahooWorkout',
			meta: {
				CreateWahooWorkForm,
				training_session: data.training_session
			}
		});
	}
	console.log(data);
</script>

<div class="card">
	<form id="update" use:focusTrap={isFocused} method="POST" use:enhance>
		<header class="card-header flex flex-col">
			<h1 class="w-full py-2 text-center">Update Training Session</h1>

			<DateInput
				name="date"
				label="Date"
				disabled={!editing}
				bind:value={$form.date}
				errors={$errors.date}
				constraints={$constraints.date}
			/>
			<EnumSelectInput
				enumType={ActivityType}
				name="activity_type"
				label="Activity Type"
				on:change={async (e) => {
					$items = [];
				}}
				bind:value={$form.activity_type}
				disabled={!editing}
				errors={$errors.activity_type}
				constraints={$constraints.activity_type}
			/>
			{#if $form.activity_type !== ActivityType.SWIM}
				<Button
					shadow="shadow-md"
					color="variant-filled-tertiary"
					type="button"
					on:click={triggerCreateWahooWorkoutModal}
					class="btn ">Create Wahoo Workout</Button
				>
			{/if}

			<TextInput
				name="title"
				label="Title"
				disabled={!editing}
				bind:value={$form.title}
				errors={$errors.title}
				constraints={$constraints.title}
			/>
			<TextArea
				name="description"
				label="Description"
				disabled={!editing}
				bind:value={$form.description}
				errors={$errors.description}
				constraints={$constraints.description}
				class="resize-none"
			/>
		</header>

		<section class="p-4">
			<!-- CREATE FORM -->
			<div class="flex flex-col overflow-hidden rounded-md p-2 bg-surface-backdrop-token">
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-row justify-center align-middle gap-2">
						<h3 class="text-sm">Duration: {secondsToHHMMSS($form.duration)}</h3>
						{#if $form.activity_type != ActivityType.BIKE}
							<h3 class="text-sm">Distance: {calculateDistance($form, $page.data.user)}</h3>
						{/if}
						<!-- IF THE ACTIVITTY IS A RUN OR SWIM, DISPLAY THE DISTANCE -->
						<h3 class="text-sm">Stress Score: {$form.stress_score}</h3>
					</div>

					<div class="flex flex-row justify-center align-middle gap-2">
						<Button
							color="variant-ghost-surface"
							type="button"
							on:click={triggerAddIntervalModal}
							class="btn p-1 rounded-sm w-fit flex flex-row gap-1"
							disabled={!editing}
						>
							<span class="text-sm">Add Interval </span>
							<PlusSquare class="w-4 h-4 !m-0 text-surface" />
						</Button>
						<Button
							color="variant-ghost-surface"
							type="button"
							disabled={!editing}
							on:click={() => {
								items.update((curr) => []);
							}}
							class="btn p-1 rounded-sm w-fit flex flex-row gap-1"
						>
							<span class="text-sm">Clear</span>
							<Undo2 class="w-4 h-4 !m-0 text-surface" />
						</Button>
					</div>
				</div>

				<section
					use:dndzone={{ items: $items, dragDisabled: !editing }}
					on:consider={handleSort}
					on:finalize={handleSort}
					class="w-full h-[100px] p-1 flex flex-row gap-px items-end justify-start snap-x hide-scrollbar overscroll-y-none"
				>
					{#each $items as item, index (item.id)}
						<div
							animate:flip={{ duration: 50 }}
							style="width: {Math.ceil(
								(item.data.duration / $form.duration) * 100
							)}%; height: {Math.ceil((item.data.intensity / max_intensity) * 100)}%"
							class="w-fit p-2 snap-x rounded-sm {getIntensityColor(
								item.data.intensity
							)} overscroll-y-none"
							use:popup={{
								event: 'click',
								target: 'intervalPopup-' + index,
								placement: 'bottom'
							}}
						>
							<div
								class="bg-surface-backdrop-token p-1 rounded-sm w-fit overscroll-y-none"
								data-popup="intervalPopup-{index}"
							>
								<div class="flex flex-row items-center align-middle justify-center gap-1">
									<span class="text-sm text-nowrap"
										>{getIntervalDisplay(item.data, $form.activity_type, $page.data.user)}</span
									>
									{#if editing}
										<Button
											id="duplicate"
											type="button"
											disabled={!editing}
											on:click={() => {
												const new_item = { ...item, id: $items.length + 1 };
												items.update((curr) => [...curr, new_item]);
											}}
											color="variant-ghost-surface"
											class="rounded-md p-px"
										>
											<CopyIcon class="w-6 h-6 p-1 text-surface-400" />
										</Button>

										<Button
											id="delete"
											type="button"
											disabled={!editing}
											on:click={() => {
												items.update((curr) =>
													curr
														.filter((i) => i.id !== item.id)
														.map((i, index) => ({ ...i, id: index }))
												);
											}}
											color="variant-ghost-surface"
											class=" rounded-md p-px"
										>
											<TrashIcon class="w-6 h-6 p-1 text-surface-400" />
										</Button>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</section>
			</div>
		</section>

		<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
			{#if !editing}
				<Button
					on:click={toggleEditing}
					shadow="shadow-md"
					color="variant-filled-primary"
					form="update"
					type="submit"
					class="btn ">Edit</Button
				>
				<Button
					formaction="?/delete"
					shadow="shadow-md"
					color="variant-filled-error"
					form="update"
					type="submit"
					class="btn ">Delete</Button
				>
			{:else}
				<Button
					on:click={toggleEditing}
					shadow="shadow-md"
					color="variant-filled-primary"
					form="update"
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
						form="update"
						type="submit"
						class="btn ">Update</Button
					>
				{/if}
			{/if}
		</footer>
	</form>
</div>
