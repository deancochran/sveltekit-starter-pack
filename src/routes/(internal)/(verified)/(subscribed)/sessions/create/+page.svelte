<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { getIntensityColor } from '$lib/components/WorkoutIntervals/types';
	import EnumSelectInput from '$lib/forms/inputs/EnumSelectInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { IntervalSchema, trainingSessionSchema } from '$lib/schemas';
	import { activityType } from '$lib/drizzle/schema';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import {
		ItemsStoreService,
		type ItemsStore
	} from '$lib/utils/dragndrop/stores';
	import {
		calculateDistance,
		evaluatePlanTss,
		getIntervalDisplay,
		type WorkoutInterval
	} from '$lib/utils/trainingsessions/types';
	import { focusTrap, getModalStore, popup } from '@skeletonlabs/skeleton';
	import { CopyIcon, PlusSquare, TrashIcon, Undo2 } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm, superValidate } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

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
	const superform = superForm(data.newTrainingSessionForm, {
		id: 'create',
		resetForm: true,
		validators: zod(trainingSessionSchema),
		delayMs: 0,
		timeoutMs: 8000,
		dataType: 'json'
	});

	const { form, errors, constraints, enhance, delayed } = superform;

	// Init drag and drop sort
	function handleSort(e: {
		detail: { items: { id: number; data: WorkoutInterval }[] };
	}) {
		$items = e.detail.items;
	}
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>(
		[]
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
</script>

<div class="card">
	<form
		id="create"
		use:focusTrap={isFocused}
		method="POST"
		action="?/create"
		use:enhance
	>
		<header class="card-header flex flex-col">
			<h1 class="w-full py-2 text-center">New Training Session</h1>
			<EnumSelectInput
				field="activityType"
				enumType={activityType.enumValues}
				{superform}
				on:change={async (e) => {
					$items = [];
				}}
			/>
			<TextInput field="title" {superform} />
			<TextArea
				field="description"
				{superform}
				name="description"
				label="Description"
			/>
		</header>

		<section class="p-4">
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
						>
							<span class="text-sm">Add Interval </span>
							<PlusSquare class="w-4 h-4 !m-0 text-surface" />
						</Button>
						<Button
							color="variant-ghost-surface"
							type="button"
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
					use:dndzone={{ items: $items, dragDisabled: false }}
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
									<Button
										id="duplicate"
										type="button"
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
								</div>
							</div>
						</div>
					{/each}
				</section>
			</div>
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
