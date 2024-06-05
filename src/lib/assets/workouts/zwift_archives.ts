import data from '$lib/assets/workouts/zwift_archives.json';
import type { WorkoutInterval } from '$lib/schemas';
import { ActivityType } from '@prisma/client';

export type ZwiftArchiveWorkoutInterval = [duration: number, intensity: number];

export enum ZwiftArchiveWorkoutCategory {
	RECOVERY = 'recovery',
	ENDURANCE = 'endurance',
	TEMPO = 'tempo',
	THRESHOLD = 'threshold',
	VO2 = 'vo2',
	ANAEROBIC = 'anaerobic'
}
export type Zwift_Archive_Workout = {
	name: string;
	description: string;
	category: ZwiftArchiveWorkoutCategory;
	intervals: Array<ZwiftArchiveWorkoutInterval>;
};

// TODO: Read Zwift Archive Workouts
export const readZwiftArchiveWorkouts = async (): Promise<Array<Zwift_Archive_Workout>> => {
	return data as unknown as Array<Zwift_Archive_Workout>;
};

export type ZwiftBikeWorkout = {
	title: string;
	activity_type: ActivityType;
	description: string;
	date?: Date;
	distance?: number;
	duration: number;
	stress_score: number;
	plan: Array<WorkoutInterval>;
};
export function convertZwiftWorkoutIntervals(workout: Zwift_Archive_Workout): ZwiftBikeWorkout {
	return {
		title: workout.name,
		activity_type: ActivityType.BIKE,
		description: workout.description,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		duration: workout.intervals.reduce((i, [duration, _intensity]) => duration, 0),
		stress_score: 0,
		plan: workout.intervals.map((interval) => {
			return { duration: interval[0], intensity: interval[1] };
		})
	};
}
