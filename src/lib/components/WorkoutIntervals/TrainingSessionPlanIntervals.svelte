<script lang="ts">
	import { page } from '$app/stores';
	import type { WorkoutInterval } from '$lib/schemas';
	import type { trainingSession } from '$lib/drizzle/schema';
	import {
		ItemsStoreService,
		type ItemsStore
	} from '$lib/utils/dragndrop/stores';
	import { getIntervalDisplay } from '$lib/utils/trainingsessions/types';
	import { popup } from '@skeletonlabs/skeleton';
	import type { InferSelectModel } from 'drizzle-orm';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { getIntensityColor } from './types';

	export let _trainingSession: InferSelectModel<typeof trainingSession>;
	let intervals = _trainingSession.plan as WorkoutInterval[];
	const max_intensity = intervals.reduce((a, b) => Math.max(a, b.intensity), 0);
	// Init drag and drop sort items
	function handleSort(e: {
		detail: { items: { id: number; data: WorkoutInterval }[] };
	}) {
		$items = e.detail.items;
	}
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>(
		intervals.map((obj, i) => ({ id: i, data: obj }))
	);
	let editing = false;
</script>

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
				(item.data.duration / _trainingSession.duration) * 100
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
				<div
					class="flex flex-row items-center align-middle justify-center gap-1"
				>
					<span class="text-sm text-nowrap"
						>{getIntervalDisplay(
							item.data,
							_trainingSession.activityType,
							$page.data.user
						)}</span
					>
				</div>
			</div>
		</div>
	{/each}
</section>
