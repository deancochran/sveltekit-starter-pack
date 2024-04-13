<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import DateInput from '$lib/forms/inputs/DateInput.svelte';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import { ActivityType } from '@prisma/client';
	import {
		training_session_schema,
		workout_interval_schema,
		type WorkoutInterval
	} from '$lib/schemas';
	import DistanceInput from '$lib/forms/inputs/customInputs/DistanceInput.svelte';
	import DurationInput from '$lib/forms/inputs/customInputs/DurationInput.svelte';
	import PercentageInput from '$lib/forms/inputs/customInputs/PercentageInput.svelte';
	import { convertSecondsToTimeDisplay } from '$lib/utils/datetime';
	import { type ItemsStore, ItemsStoreService } from '$lib/utils/dragndrop/stores';
	import { WorkoutIntervalService } from '$lib/utils/trainingsessions/stores';
	import { IntervalType } from '$lib/utils/trainingsessions/types';
	import { PlusSquare, CopyIcon, TrashIcon } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { get } from 'svelte/store';

	export let data: PageData;
	console.log(data);

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
		$form.plan = intervals;
		$form.stress_score = 0;
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
	const {
		form: plan_form,
		errors: plan_errors,
		constraints: plan_constraints,
		validateForm: plan_validateForm
	} = superForm(data.workout_interval_form, {
		id: 'workout_interval_form',
		validators: zod(workout_interval_schema)
	});
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Update Training Session</h1>
	</header>
	<section class="p-4">
		<form id="update" use:focusTrap={isFocused} method="POST" action="?/update" use:enhance>
			<div class="flex w-full flex-row flex-wrap">
				<TextInput
					name="title"
					label="Title"
					bind:value={$form.title}
					errors={$errors.title}
					constraints={$constraints.title}
				/>
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
					bind:value={$form.activity_type}
					errors={$errors.activity_type}
					constraints={$constraints.activity_type}
				/>
			</div>
			<TextArea
				name="description"
				label="Description"
				bind:value={$form.description}
				errors={$errors.description}
				constraints={$constraints.description}
			/>
			<div class="bg-surface-backdrop-token bg-opacity-25 p-4 rounded-md">
				<form
					id="workout_interval_form"
					on:submit|preventDefault={async () => {
						const res = await plan_validateForm();
						if (res.valid) {
							$items = [...$items, { id: $items.length + 1, data: $plan_form }];
						}
					}}
				>
					<div class="flex w-full flex-row flex-wrap">
						<DurationInput
							name="duration"
							label="Duration"
							bind:value={$plan_form.duration}
							errors={$plan_errors.duration}
							constraints={$plan_constraints.duration}
						/>
						<DistanceInput
							name="distance"
							label="Distance"
							bind:value={$plan_form.distance}
							errors={$plan_errors.distance}
							constraints={$plan_constraints.distance}
						/>
						<EnumSelectInput
							enumType={IntervalType}
							name="interval_type"
							label="Interval Type"
							disabled={true}
							bind:value={$plan_form.interval_type}
							errors={$plan_errors.interval_type}
							constraints={$plan_constraints.interval_type}
						/>
						{#if $plan_form.interval_type === IntervalType.BLOCK}
							<PercentageInput
								name="intensity"
								label="Intensity"
								bind:value={$plan_form.intensity}
								constraints={$plan_constraints.intensity}
							/>
						{:else}
							<PercentageInput
								name="start_intensity"
								label="Start Intensity"
								bind:value={$plan_form.start_intensity}
								constraints={$plan_constraints.start_intensity}
							/>
							<PercentageInput
								name="end_intensity"
								label="End Intensity"
								bind:value={$plan_form.end_intensity}
								constraints={$plan_constraints.end_intensity}
							/>
						{/if}
						<Button
							shadow="shadow-md"
							color="variant-filled-primary"
							form="workout_interval_form"
							type="submit"
							class="btn "
						>
							<PlusSquare />
						</Button>
					</div>
				</form>
			</div>

			<section
				use:dndzone={{ items: $items }}
				on:consider={handleSort}
				on:finalize={handleSort}
				class=" w-full flex flex-row gap-2 overflow-x-auto items-end justify-start snap-mandatory snap-normal snap-x"
			>
				{#each $items as item (item.id)}
					<div
						animate:flip={{ duration: 100 }}
						class="card card-hover variant-filled-surface flex flex-col justify-between w-full h-full snap-center min-w-[20vw] bg-red-400"
					>
						<section class="flex flex-col p-2">
							<!-- <span class="text-sm">{item.data.interval_type}</span>

							<span class="text-sm">
								{convertSecondsToTimeDisplay(item.data.duration)}
							</span>
							{#if item.data.interval_type === IntervalType.BLOCK}
								<span class="text-lg font-bold">@{item.data.intensity}%</span>
							{:else}
								<span class="text-lg font-bold">@{item.data.start_intensity}%</span>
								<span class="text-lg font-bold">to{item.data.end_intensity}%</span>
							{/if} -->
						</section>
						<footer class="card-footer p-1 gap-1 w-full flex items-end align-middle justify-end">
							<Button
								type="button"
								on:click={() => {
									const new_item = { ...item, id: $items.length + 1 };
									$items = [...$items, new_item];
								}}
								color="variant-soft-tertiary"
								class=" rounded-md p-2"
							>
								<CopyIcon />
							</Button>
							<Button
								type="button"
								on:click={() => {
									$items = $items
										.filter((i) => i.id !== item.id)
										.map((i, index) => ({ ...i, id: index + 1 }));
								}}
								color="variant-soft-tertiary"
								class=" rounded-md p-2"
							>
								<TrashIcon />
							</Button>
						</footer>
					</div>
				{/each}
			</section>
		</form>
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
</div>
