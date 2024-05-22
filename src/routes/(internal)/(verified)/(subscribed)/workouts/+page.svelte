<script lang="ts">
	import {
		convertZwiftWorkoutIntervals,
		type Zwift_Archive_Workout
	} from '$lib/assets/workouts/zwift_archives';
	import WorkoutIntervals from '$lib/components/WorkoutIntervals/WorkoutIntervals.svelte';
	import ZoneDistribution from '$lib/components/WorkoutIntervals/ZoneDistribution.svelte';
	import type { WorkoutInterval } from '$lib/schemas';
	import { secondsToHHMMSS } from '$lib/utils/datetime';
	import type { PageData } from './$types';

	export let data: PageData;

	function calculateTotalDuration(intervals: WorkoutInterval[]): number {
		return intervals.reduce((acc: number, {duration, intensity}) => {
			return acc + duration;
		}, 0);
	}

	function interval_stress_score(interval: WorkoutInterval):number{
		// assumes ftp == 1
		// therefore np = ftp * _if == _if
		// tss = (duration * np * intensity) / (FTP*3600) * 100... therefore
		// tss = (duration * intensity^2) / (3600) * 100 
		return (interval.duration * Math.pow(interval.intensity, 2)) / (3600) * 100;
	}
	function intervals_stress_score(intervals: WorkoutInterval[]): number {
		return intervals.reduce((total, interval) => total + interval_stress_score(interval), 0)
	}

</script>

<h1>Cadence Workouts</h1>

<br />

<div>
	{#each data.workouts as workout}
	{@const training_session = convertZwiftWorkoutIntervals(workout)}
	{@const totalDuration = calculateTotalDuration(training_session.plan)}
	{@const cTSS = intervals_stress_score(training_session.plan).toFixed(0)}
		<div class="card">
			<header class="card-header flex flex-col justify-center">
				<div class="flex flex-row justify-between">
					<h1>{workout.name}</h1>
					<span class="chip variant-filled">{workout.category}</span>
					
				</div>
				<span>Duration: {secondsToHHMMSS(totalDuration)}</span>
				<span>TSS: {cTSS}</span>
				<h1>{workout.description}</h1>
			</header>
			<section class="p-4 flex flex-col">
				<ZoneDistribution
					intervals={training_session.plan}
					total_duration={totalDuration}
				/>
				
				<WorkoutIntervals
					intervals={training_session.plan}
					total_duration={totalDuration}
				/>
			</section>
			<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
				<!-- {workout.total_duration} -->
				<!-- Stress Score: {calc_cTss_from_intervals(
					convert_ZwiftArchiveWorkoutIntervals(workout.intervals)
				)} -->
			</footer>
		</div>
	{/each}
</div>
