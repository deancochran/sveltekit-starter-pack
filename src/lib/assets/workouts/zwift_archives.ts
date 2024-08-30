import data from '$lib/assets/workouts/zwift_archives.json';
import type { WorkoutInterval } from '$lib/schemas';

export type ZwiftArchiveWorkoutInterval = [duration: number, intensity: number];

export enum ZwiftArchiveWorkoutCategory {
	RECOVERY = 'recovery',
	ENDURANCE = 'endurance',
	TEMPO = 'tempo',
	THRESHOLD = 'threshold',
	VO2 = 'vo2',
	ANAEROBIC = 'anaerobic'
}
export type ZwiftArchiveWorkout = {
	name: string;
	description: string;
	category: ZwiftArchiveWorkoutCategory;
	intervals: Array<ZwiftArchiveWorkoutInterval>;
};

// TODO: Read Zwift Archive Workouts
export const readZwiftArchiveWorkouts = async (): Promise<
	Array<ZwiftArchiveWorkout>
> => {
	return data as unknown as Array<ZwiftArchiveWorkout>;
};

export type ZwiftBikeWorkout = {
	title: string;
	activityType: 'SWIM' | 'BIKE' | 'RUN';
	description: string;
	date?: Date;
	distance?: number;
	duration: number;
	stress_score: number;
	plan: Array<WorkoutInterval>;
};
export function convertZwiftWorkoutIntervals(
	workout: ZwiftArchiveWorkout
): ZwiftBikeWorkout {
	return {
		title: workout.name,
		activityType: 'BIKE',
		description: workout.description,

		duration: workout.intervals.reduce((i, [duration]) => duration, 0),
		stress_score: 0,
		plan: workout.intervals.map((interval) => {
			return { duration: interval[0], intensity: interval[1] };
		})
	};
}
