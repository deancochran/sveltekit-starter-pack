<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { focusTrap, getModalStore, popup } from '@skeletonlabs/skeleton';
	import { superForm, superValidate } from 'sveltekit-superforms';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	// import IntervalCard from '$lib/compone	nts/WorkoutInterval/IntervalCard.svelte';
	import ZoneDistribution from '$lib/components/WorkoutIntervals/ZoneDistribution.svelte';
	import {
		IntervalSchema,
		createWahooWorkoutSchema,
		trainingSessionSchema,
		type CreateWahooWorkoutSchema,
		type WorkoutInterval
	} from '$lib/schemas';
	import {
		ItemsStoreService,
		type ItemsStore
	} from '$lib/utils/dragndrop/stores';
	// import { WorkoutIntervalService } from '$lib/utils/trainingsessions/stores';
	import {
		// calculateAvgWatts,
		calculateDistance,
		evaluatePlanTss,
		getIntervalDisplay
	} from '$lib/utils/trainingsessions/types';
	import { CopyIcon, PlusSquare, TrashIcon, Undo2 } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	// import { get } from 'svelte/store';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	// import WorkoutIntervals from '$lib/components/WorkoutIntervals/WorkoutIntervals.svelte';

	import { page } from '$app/stores';
	import { getIntensityColor } from '$lib/components/WorkoutIntervals/types';
	import { activityType } from '$lib/drizzle/schema';
	import { generateId } from 'lucia';
	import { getWahooWorkoutIdFromTrainingSessionType } from '$lib/integrations/wahoo/utils';

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
				activityType: $form.activityType
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

	const superform = superForm(data.trainingSessionForm, {
		id: 'update',
		resetForm: false,
		validators: zod(trainingSessionSchema),
		delayMs: 0,
		timeoutMs: 8000,
		dataType: 'json',
		onResult: (e) => {
			if (e.result.type === 'success') {
				toggleEditing();
			}
		}
	});
	const { form, errors, constraints, enhance, delayed, reset } = superform;

	// Init edit mode
	$: editing = false;
	function toggleEditing(): void {
		editing = !editing;
		isFocused = !isFocused;
		if (!editing) {
			reset();
			$items = $form.plan.map((obj: any, i: any) => ({ id: i, data: obj }));
		}
	}

	// Init drag and drop sort items
	function handleSort(e: {
		detail: { items: { id: number; data: WorkoutInterval }[] };
	}) {
		$items = e.detail.items;
	}
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>(
		$form.plan.map((obj: any, i: any) => ({ id: i, data: obj }))
	);

	items.subscribe((curr) => {
		$form.duration = curr.reduce((a, b) => a + b.data.duration, 0);
		const intervals = [...curr.map((i) => i.data)];
		$form.stressScore = evaluatePlanTss(
			data.user!,
			$form.activityType,
			intervals
		).stressScore;
		$form.plan = intervals;
	});

	$: max_intensity = $items.reduce((a, b) => Math.max(a, b.data.intensity), 0);

	// Init modal
	async function triggerCreateWahooWorkoutModal() {
		const init_data: Infer<CreateWahooWorkoutSchema> = {
			name: data.trainingSession.title,
			workout_type_id: getWahooWorkoutIdFromTrainingSessionType(
				data.trainingSession.activityType
			),
			starts: new Date(),
			minutes: data.trainingSession.duration ?? 0,
			workoutToken: generateId(50)
		};
		const CreateWahooWorkForm = await superValidate(
			init_data,
			zod(createWahooWorkoutSchema)
		);

		modal.trigger({
			type: 'component',
			component: 'CreateWahooWorkout',
			meta: {
				CreateWahooWorkForm,
				trainingSession: data.trainingSession
			}
		});
	}
</script>

<div class="card">
	<form id="update" use:focusTrap={isFocused} method="POST" use:enhance>
		<header class="card-header flex flex-col">
			<h1 class="w-full py-2 text-center">Update Training Session</h1>

			<EnumSelectInput
				enumType={activityType.enumValues}
				field="activityType"
				{superform}
				on:change={async (e) => {
					$items = [];
				}}
				disabled={!editing}
			/>
			{#if $form.activityType !== 'SWIM'}
				<Button
					shadow="shadow-md"
					color="variant-filled-tertiary"
					type="button"
					on:click={triggerCreateWahooWorkoutModal}
					class="btn ">Create Wahoo Workout</Button
				>
			{/if}

			<TextInput field="title" {superform} label="Title" disabled={!editing} />
			<TextArea
				field="description"
				{superform}
				label="Title"
				disabled={!editing}
			/>
		</header>

		<section class="p-4">
			<!-- CREATE FORM -->
			<div
				class="flex flex-col overflow-hidden rounded-md p-2 bg-surface-backdrop-token"
			>
				<div class="flex flex-row items-center justify-between">
					<div class="flex flex-row justify-center align-middle gap-2">
						<h3 class="text-sm">Duration: {secondsToHHMMSS($form.duration)}</h3>
						{#if $form.activityType != 'BIKE'}
							<h3 class="text-sm">
								Distance: {calculateDistance($form, $page.data.user)}
							</h3>
						{/if}
						<!-- IF THE ACTIVITTY IS A RUN OR SWIM, DISPLAY THE DISTANCE -->
						<h3 class="text-sm">Stress Score: {$form.stressScore}</h3>
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
				<ZoneDistribution
					intervals={$form.plan}
					totalDuration={$form.duration}
				/>

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
							)}%; height: {Math.ceil(
								(item.data.intensity / max_intensity) * 100
							)}%"
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
								<div
									class="flex flex-row items-center align-middle justify-center gap-1"
								>
									<span class="text-sm text-nowrap"
										>{getIntervalDisplay(
											item.data,
											$form.activityType,
											$page.data.user
										)}</span
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

		<footer
			class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2"
		>
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
					color="variant-filled-error"
					form="update"
					type="button"
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
