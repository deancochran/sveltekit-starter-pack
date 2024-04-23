import { type WorkoutSession } from '$lib/utils/trainingsessions/types';
import { ActivityType, type trainingSession, type user } from '@prisma/client';
import {
	WAHOO_PLAN_FAMILY_TYPE,
	WAHOO_PLAN_INTENSITY_TYPE,
	WAHOO_PLAN_TARGET_TYPE,
	WAHOO_PLAN_TRIGGER_TYPE,
	WAHOO_PLAN_WORKOUT_TYPE_LOCATION,
	WahooWorkoutTypeID,
	type WAHOO_PLAN_INTERVALS,
	type WahooV1Plan
} from './types';
import type { User } from 'lucia';
import { secondsToHHMMSS } from '$lib/utils/datetime';

export function convertTrainingSessionToWahooPlan(
	user: User | user,
	training_session: trainingSession
): WahooV1Plan {
	//TODO: convert training_session of type trainingSession to a WahooV1Plan
	let workout_type_family: number;
	let user_ftp: number;

	if (training_session.activity_type === ActivityType.RUN) {
		workout_type_family = WAHOO_PLAN_FAMILY_TYPE.RUNNING;
		user_ftp = user.run_ftp;
	} else if (training_session.activity_type === ActivityType.BIKE) {
		workout_type_family = WAHOO_PLAN_FAMILY_TYPE.BIKING;
		user_ftp = user.bike_ftp;
	} else {
		throw new Error('Unsupported activity type');
	}

	const header: WahooV1Plan['header'] = {
		name: training_session.title,
		version: '1.0.0',
		// description: training_session.description ?? undefined,
		workout_type_family: workout_type_family,
		workout_type_location: WAHOO_PLAN_WORKOUT_TYPE_LOCATION.INDOOR,
		ftp: user_ftp ?? undefined
	};
	const intervals: WahooV1Plan['intervals'] = [];
	const workout_intervals = training_session.plan as WorkoutSession;
	for (let i = 0; i < workout_intervals.length; i++) {
		const interval = workout_intervals[i];
		const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
		const wahoo_interval: WAHOO_PLAN_INTERVALS = {
			name: `${avg_intensity}% FTP` + ` for ${secondsToHHMMSS(interval.duration)}`,
			exit_trigger_type: WAHOO_PLAN_TRIGGER_TYPE.TIME,
			exit_trigger_value: interval.duration,
			intensity_type: WAHOO_PLAN_INTENSITY_TYPE.ACTIVE,
			targets: [
				{
					type: WAHOO_PLAN_TARGET_TYPE.FTP,
					low: avg_intensity - avg_intensity * 0.05,
					high: avg_intensity + avg_intensity * 0.05
				}
			]
		};
		intervals.push(wahoo_interval);
	}

	const res: WahooV1Plan = {
		header,
		intervals
	};

	return res;
}

export function getWahooWorkoutIdFromTrainingSessionType(activity_type: ActivityType) {
	switch (activity_type) {
		case ActivityType.RUN:
			return WahooWorkoutTypeID.RUNNING;
		case ActivityType.BIKE:
			return WahooWorkoutTypeID.BIKING;
		case ActivityType.SWIM:
			return WahooWorkoutTypeID.SWIMMING_LAP;
		default:
			throw new Error('Unsupported activity type');
	}
}
