<script lang="ts">
	import type { WorkoutInterval } from '$lib/utils/trainingsessions/types';
	import { FTP_INTENSITY, getIntensityColor } from './types';
	import { page } from '$app/stores';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { secondsToHHMMSS } from '$lib/utils/datetime';

	export let intervals: WorkoutInterval[];
	export let total_duration: number;
	const max_intensity = intervals.reduce((a, b) => Math.max(a, b.intensity), 0);
</script>

{#key intervals}
	<div class="relative w-full h-full">
		<!-- TODO: Add FTP Bar here... when the user is logged in show their FTP given the activityType -->
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
				<!-- POPUP CONTENT -->
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
{/key}
