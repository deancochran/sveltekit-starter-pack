<script lang="ts">
	import type { WorkoutInterval } from '$lib/utils/trainingsessions/types';
	import { getIntensityColorByZoneNumber, getIntensityZone } from './types';

	export let intervals: WorkoutInterval[];
	export let total_duration: number;

	let zone_durations = {
		'Zone 1': 0,
		'Zone 2': 0,
		'Zone 3': 0,
		'Zone 4': 0,
		'Zone 5': 0
	};

	$: {
		zone_durations['Zone 1'] = 0;
		zone_durations['Zone 2'] = 0;
		zone_durations['Zone 3'] = 0;
		zone_durations['Zone 4'] = 0;
		zone_durations['Zone 5'] = 0;
		for (const interval of intervals) {
			const zone = getIntensityZone(interval.intensity);
			switch (zone) {
				case 'z1':
					zone_durations['Zone 1'] += interval.duration;
					break;
				case 'z2':
					zone_durations['Zone 2'] += interval.duration;
					break;
				case 'z3':
					zone_durations['Zone 3'] += interval.duration;
					break;
				case 'z4':
					zone_durations['Zone 4'] += interval.duration;
					break;
				case 'z5':
					zone_durations['Zone 5'] += interval.duration;
					break;
			}
		}
	}
</script>

<div class="relative flex flex-row items-end align-baseline justify-between p-2">
	{#each Object.entries(zone_durations) as [key, zone_duration], i}
		{@const duration_percentage = zone_duration / total_duration}
		{@const height = duration_percentage * 100 + 1}
		{@const color = getIntensityColorByZoneNumber(i + 1)}
		<div class="relative w-full h-full flex flex-col overflow-hidden">
			<p class="text-sm text-center text-nowrap">
				{(Number(duration_percentage.toFixed(2)) * 100).toFixed(0)}%
			</p>

			<div
				style=" height: {height}px"
				class="rounded-sm relative w-full {color} overflow-clip"
			></div>
			<span class="text-sm text-center text-nowrap">{key}</span>
		</div>
	{/each}
</div>
