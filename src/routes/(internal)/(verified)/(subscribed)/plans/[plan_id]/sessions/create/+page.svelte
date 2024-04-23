<script lang="ts">
	import { training_session_schema, workout_interval_schema } from '$lib/schemas';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap, getModalStore } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import type { PageData } from './$types';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import { ActivityType } from '@prisma/client';
	import { WorkoutIntervalService } from '$lib/utils/trainingsessions/stores';
	import { CopyIcon, PlusSquare, TrashIcon } from 'lucide-svelte';
	import { get } from 'svelte/store';
	import {
		IntervalType,
		evaluatePlanTss,
		type WorkoutInterval,
		calculateAvgWatts
	} from '$lib/utils/trainingsessions/types';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { type ItemsStore, ItemsStoreService } from '$lib/utils/dragndrop/stores';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import { convertDistance } from '$lib/utils/distance';

	export let data: PageData;
	let modal = getModalStore();
	const { form, errors, constraints, enhance, delayed } = superForm(data.trainingSessionSchema, {
		id: 'create',
		resetForm: true,
		validators: zod(training_session_schema),
		delayMs: 0,
		timeoutMs: 8000,
		dataType: 'json'
	});

	let isFocused: boolean = false;

	const workout = WorkoutIntervalService([]);
	workout.subscribe(() => {
		const intervals = get(workout);
		let totalDuration_ = 0;
		let totalDistance_ = 0;
		intervals.forEach((i) => {
			totalDuration_ += i.duration ?? 0;
			totalDistance_ += i.distance ?? 0;
		});

		$form.duration = totalDuration_;
		$form.distance = totalDistance_;
		$form.stress_score = evaluatePlanTss(data.user, $form.activity_type, intervals);
		$form.plan = intervals;
	});

	function handleSort(e: { detail: { items: { id: number; data: WorkoutInterval }[] } }) {
		$items = e.detail.items;
	}
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>([]);

	items.subscribe(() => {
		workout.set([...$items.map((i) => i.data)]);
	});
	const {
		form: plan_form,
		errors: plan_errors,
		constraints: plan_constraints,
		validateForm: plan_validateForm,
		reset: plan_reset
	} = superForm(data.workoutIntervalSchema, {
		id: 'NewSessionPlanForm',
		validators: zod(workout_interval_schema),
		dataType: 'json',
		resetForm: true
	});
	$plan_form.interval_type = IntervalType.RAMP;

	// AddInterval Modal
	function triggerAddIntervalModal() {
		modal.trigger({
			type: 'component',
			component: 'AddInterval',
			meta: {
				form: plan_form,
				errors: plan_errors,
				constraints: plan_constraints,
				validateForm: plan_validateForm,
				reset: plan_reset,
				activity_type: $form.activity_type
			},
			response: (r) => {
				if (r) {
					$items = [...$items, { id: $items.length + 1, data: $plan_form }];
				}
			}
		});
	}
	$form.title =
		new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()) + ' ' + 'Workout';
</script>

<div class="card">
	<form id="create" use:focusTrap={isFocused} method="POST" action="?/create" use:enhance>
		<header class="card-header flex flex-col">
			<h1 class="w-full py-2 text-center">New Training Session</h1>
			<div class="flex w-full flex-row gap-4 justify-between">
				<DateInput
					name="date"
					label="Date"
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
						$workout = [];
					}}
					bind:value={$form.activity_type}
					errors={$errors.activity_type}
					constraints={$constraints.activity_type}
				/>
			</div>
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
				class="resize-none"
			/>
		</header>
		<hr class="w-full" />
		<section class="flex p-4 flex-col gap-4">
			<div class="w-full flex flex-row flex-wrap justify-between gap-4">
				<h3 class="h3">Duration: {secondsToHHMMSS($form.duration)}</h3>

				{#if $form.activity_type === ActivityType.BIKE}
					<h3 class="h3">
						Avg Watts: {calculateAvgWatts(data.user, $form.plan).toFixed(0)} w
					</h3>
				{:else}
					<h3 class="h3">
						Distance: {convertDistance($form.distance, 'kilometers').toFixed(2)} km
					</h3>
				{/if}
				<h3 class="h3">Stress Score: {$form.stress_score.toFixed(2)}</h3>
			</div>
			<hr class="w-full" />
			<div class="w-full flex flex-row gap-4 flex-wrap items-center align-middle justify-between">
				<h3 class="h3">Intervals</h3>
				<Button
					color="variant-soft-tertiary"
					type="button"
					on:click={triggerAddIntervalModal}
					class="btn"
				>
					<span>Add Interval </span>
					<PlusSquare />
				</Button>
			</div>

			<section
				use:dndzone={{ items: $items, dragDisabled: false }}
				on:consider={handleSort}
				on:finalize={handleSort}
				class=" w-full flex flex-row p-2 shadow-inner bg-surface-backdrop-token rounded-md gap-2 overflow-x-auto items-end justify-start snap-mandatory snap-normal snap-x"
			>
				{#if $items.length === 0}
					<p class="w-full text-center">No Intervals</p>
				{:else}
					{#each $items as item, index (item.id)}
						<div
							animate:flip={{ duration: 100 }}
							class="card variant-filled-surface flex flex-col justify-between w-full h-full snap-center"
						>
							<section class="p-2">
								<!-- Interval Display -->
								<div class="flex flex-row gap-1">
									{#if item.data.interval_type === IntervalType.RAMP}
										<span class="text-sm"
											>@{item.data.start_intensity.toFixed(2)} to {item.data.end_intensity.toFixed(
												2
											)}% FTP</span
										>
									{:else}
											<p>Undefined IntervalType</p>
									{/if}
									<span class="text-sm">in {secondsToHHMMSS(item.data.duration)}</span>
								</div>
							</section>

							<footer class="card-footer p-1 gap-1 w-full flex items-end align-middle justify-end">
								<Button
									type="button"
									on:click={() => {
										const new_item = { ...item, id: item.id + 1 };

										$items = $items.map((i) => {
											if (i.id > item.id) {
												return { ...i, id: i.id + 1 };
											} else {
												return i;
											}
										});

										$items = [...$items.slice(0, index + 1), new_item, ...$items.slice(index + 1)];
									}}
									color="variant-soft-tertiary"
									class=" rounded-md p-2"
								>
									<CopyIcon />
								</Button>

								<Button
									type="button"
									on:click={() => {
										$items = $items.filter((i) => i.id !== item.id);
									}}
									color="variant-soft-tertiary"
									class=" rounded-md p-2"
								>
									<TrashIcon />
								</Button>
							</footer>
						</div>
					{/each}
				{/if}
			</section>
		</section>
		<footer
			class="w-full card-footer flex flex-row flex-wrap items-end align-middle justify-end gap-2"
		>
			{#if $delayed}
				<LoadingIcon />
			{:else}
				<Button
					shadow="shadow-md"
					color="variant-filled-primary"
					form="create"
					type="submit"
					class="btn ">Create</Button
				>
			{/if}
		</footer>
	</form>
</div>
