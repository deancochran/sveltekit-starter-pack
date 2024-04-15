<script lang="ts">
	import { superForm, superValidate, type SuperForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { focusTrap, getModalStore } from '@skeletonlabs/skeleton';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import IntervalCard from '$lib/components/WorkoutInterval/IntervalCard.svelte';
	import { ActivityType } from '@prisma/client';
	import {
		training_session_schema,
		workout_interval_schema,
		type WorkoutInterval
	} from '$lib/schemas';
	import { type ItemsStore, ItemsStoreService } from '$lib/utils/dragndrop/stores';
	import { WorkoutIntervalService } from '$lib/utils/trainingsessions/stores';
	import { calculateAvgWatts, evaluatePlanTss } from '$lib/utils/trainingsessions/types';
	import { PlusSquare } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { get } from 'svelte/store';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import { convertDistance } from '$lib/utils/distance';

	export let data: PageData;

	let editing = false;
	let isFocused: boolean = false;

	const { form, errors, constraints, enhance, delayed, reset } = superForm(
		data.training_session_form,
		{
			id: 'update',
			resetForm: true,
			validators: zod(training_session_schema),
			delayMs: 0,
			timeoutMs: 8000,
			dataType: 'json'
		}
	);
	function toggleEditing(e: CustomEvent<any>): void {
		editing = !editing;
		isFocused = !isFocused;
		if (!editing) {
			reset();
			$items = $form.plan.map((obj, i) => ({ id: i, data: obj }));
		}
	}

	const workout = WorkoutIntervalService($form.plan ?? []);
	workout.subscribe(() => {
		const intervals = get(workout);
		let totalDuration_ = 0;
		let totalDistance_ = 0;
		intervals.forEach((i) => {
			totalDuration_ += i.duration;
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
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>(
		$form.plan.map((obj, i) => ({ id: i, data: obj }))
	);
	items.subscribe(() => {
		workout.set([...$items.map((i) => i.data)]);
	});

	let modal = getModalStore();
	// AddInterval Modal
	async function triggerAddIntervalModal() {
		const interval = await superValidate(zod(workout_interval_schema));
		modal.trigger({
			type: 'component',
			component: 'AddInterval',
			meta: {
				activity_type: $form.activity_type,
				...superForm(interval, {
					id: 'NewSessionPlanForm',
					validators: zod(workout_interval_schema)
				})
			},
			response: (data) => {
				if (data) {
					$items = [...$items, { id: $items.length + 1, data }];
				}
			}
		});
	}
</script>

<div class="card">
	<form id="update" use:focusTrap={isFocused} method="POST" action="?/update" use:enhance>
		<header class="card-header flex flex-col">
			<h1 class="w-full py-2 text-center">Update Training Session</h1>
			<div class="flex w-full flex-row gap-4 justify-between">
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
						$workout = [];
					}}
					bind:value={$form.activity_type}
					disabled={!editing}
					errors={$errors.activity_type}
					constraints={$constraints.activity_type}
				/>
			</div>
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
		<hr class="w-full" />
		<section class="flex p-4 flex-col gap-4">
			<div class="w-full flex flex-row flex-wrap justify-between gap-4">
				<h3 class="h3">Duration: {secondsToHHMMSS($form.duration)}</h3>

				{#if $form.activity_type === ActivityType.BIKE}
					<h3 class="h3">
						Avg Watts: {calculateAvgWatts(data.user, $form.plan).toFixed(0)} km
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
					disabled={!editing}
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
				use:dndzone={{ items: $items, dragDisabled: !editing }}
				on:consider={handleSort}
				on:finalize={handleSort}
				class=" w-full flex flex-row p-2 shadow-inner bg-surface-backdrop-token rounded-md gap-2 overflow-x-auto items-end justify-start snap-mandatory snap-normal snap-x"
			>
				{#if $items.length === 0}
					<p class="w-full text-center">No Intervals</p>
				{:else}
					{#each $items as item, index (item.id)}
						<div animate:flip={{ duration: 100 }} class="w-full">
							<IntervalCard
								on:delete={() => ($items = $items.filter((i) => i.id !== item.id))}
								on:duplicate={() => {
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
								bind:editing
								bind:activity_type={$form.activity_type}
								{item}
							/>
						</div>
					{/each}
				{/if}
			</section>
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
