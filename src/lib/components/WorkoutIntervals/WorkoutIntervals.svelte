<script lang="ts">
	import { getIntervalDisplay, type WorkoutInterval } from '$lib/utils/trainingsessions/types';
	import { FTP_INTENSITY, getIntensityColor } from './types';
	import { page } from '$app/stores';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import { CopyIcon, TrashIcon } from 'lucide-svelte';
	import { dndzone } from 'svelte-dnd-action';
	import { Button } from 'svelte-email';
	import { flip } from 'svelte/animate';
	import type { ActivityType } from '@prisma/client';
	import { ItemsStoreService, type ItemsStore } from '$lib/utils/dragndrop/stores';

	export let intervals: WorkoutInterval[];
	export let total_duration: number;
	const max_intensity = intervals.reduce((a, b) => Math.max(a, b.intensity), 0);
	// Init drag and drop sort items
	function handleSort(e: { detail: { items: { id: number; data: WorkoutInterval }[] } }) {
		$items = e.detail.items;
	}
	let items: ItemsStore<WorkoutInterval> = ItemsStoreService<WorkoutInterval>(
		intervals.map((obj, i) => ({ id: i, data: obj }))
	);
	let activity_type: ActivityType;
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
			style="width: {Math.ceil((item.data.duration / total_duration) * 100)}%; height: {Math.ceil(
				(item.data.intensity / max_intensity) * 100
			)}%"
			class="w-fit p-2 snap-x rounded-sm {getIntensityColor(item.data.intensity)} overscroll-y-none"
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
						>{getIntervalDisplay(item.data, activity_type, $page.data.user)}</span
					>
					<!-- {#if editing}
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
									{/if} -->
				</div>
			</div>
		</div>
	{/each}
</section>

<!-- {#key intervals}
	<div class="relative w-full h-full">
		<div class=" w-full h-full flex flex-row items-baseline gap-px">
			{#each intervals as interval, i}
				{@const height = Math.ceil((interval.intensity / max_intensity) * 100)}
				{@const width = Math.ceil((interval.duration / total_duration) * 100)}
				<div
					style="width: {width}%; height: {height}px"
					class="card-hover hover:scale-110 rounded-sm flex items-end {getIntensityColor(
						interval.intensity
					)} overflow-hidden [&>*]:pointer-events-none"
					use:popup={{ event: 'hover', target: 'intervalPopup-' + i, placement: 'bottom' }}
				></div>
				<div
					class="bg-surface-backdrop-token -mt-2 z-auto drop-shadow-sm px-1 py-px rounded-sm w-fit overflow-hidden"
					data-popup="intervalPopup-{i}"
				>
					<span class="text-xs text-nowrap"
						>{secondsToHHMMSS(interval.duration)} at {interval.intensity}% FTP</span
					>
				</div>
			{/each}
		</div>
	</div>
{/key} -->
