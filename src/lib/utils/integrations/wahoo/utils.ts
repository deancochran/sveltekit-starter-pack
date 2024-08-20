import { secondsToHHMMSS } from '$lib/utils/datetime';
import { type WorkoutSession } from '$lib/utils/trainingsessions/types';
import { ActivityType, type trainingSession, type user } from '@prisma/client';
import type { User } from 'lucia';
import {
    WAHOO_PLAN_FAMILY_TYPE,
    WAHOO_PLAN_INTENSITY_TYPE,
    WAHOO_PLAN_TARGET_TYPE,
    WAHOO_PLAN_TRIGGER_TYPE,
    WahooWorkoutTypeID,
    type WAHOO_PLAN_INTERVALS,
    type WahooV1Plan
} from './types';

function getWahooIntervalIntensityType(intensity: number) {
	if (intensity < 0.01) {
		return WAHOO_PLAN_INTENSITY_TYPE.REST;
	} else if (intensity < 0.55 && intensity >= 0.01) {
		return WAHOO_PLAN_INTENSITY_TYPE.RECOVER;
	} else if (intensity < 0.75 && intensity >= 0.55) {
		return WAHOO_PLAN_INTENSITY_TYPE.ACTIVE;
	} else if (intensity < 0.9 && intensity >= 0.75) {
		return WAHOO_PLAN_INTENSITY_TYPE.TEMPO;
	} else if (intensity < 1.05 && intensity >= 0.9) {
		return WAHOO_PLAN_INTENSITY_TYPE.FTP;
	} else if (intensity < 1.2 && intensity >= 1.05) {
		return WAHOO_PLAN_INTENSITY_TYPE.MAP;
	} else if (intensity >= 1.2) {
		return WAHOO_PLAN_INTENSITY_TYPE.AC;
	} else {
		return WAHOO_PLAN_INTENSITY_TYPE.REST;
	}
}

export function convertTrainingSessionToWahooPlan(
	user: User | user,
	training_session: trainingSession
): WahooV1Plan {
	let workout_type_family: number;

	if (training_session.activity_type === ActivityType.RUN) {
		if (!user.run_ftp) throw new Error('no run ftp');
		workout_type_family = WAHOO_PLAN_FAMILY_TYPE.RUNNING;
	} else if (training_session.activity_type === ActivityType.BIKE) {
		if (!user.bike_ftp) throw new Error('no bike ftp');
		workout_type_family = WAHOO_PLAN_FAMILY_TYPE.BIKING;
	} else {
		throw new Error('Unsupported activity type');
	}
	const header: WahooV1Plan['header'] = {
		name: training_session.title,
		version: '1.0.0',
		// description: training_session.description ?? undefined,
		workout_type_family: workout_type_family
		// workout_type_location: WAHOO_PLAN_WORKOUT_TYPE_LOCATION.INDOOR
	};
	if (workout_type_family == WAHOO_PLAN_FAMILY_TYPE.BIKING) header['ftp'] = user.bike_ftp;
	const intervals: WahooV1Plan['intervals'] = [];
	const workout_intervals = training_session.plan as WorkoutSession;
	for (let i = 0; i < workout_intervals.length; i++) {
		let interval_name: string = '';
		let interval_s_p_km: number = 0;
		let target;
		const interval = workout_intervals[i];
		switch (workout_type_family) {
			case WAHOO_PLAN_FAMILY_TYPE.RUNNING:
				let m_p_s: number;
				if (interval.intensity > 1) {
					interval_s_p_km = Number(user.run_ftp - (interval.intensity - 1) * user.run_ftp);
				} else {
					interval_s_p_km = Number(user.run_ftp + (1 - interval.intensity) * user.run_ftp);
				}
				const interval_m_p_s = 1000 / interval_s_p_km;
				let low_speed = interval_m_p_s - 0.1;
				let high_speed = interval_m_p_s + 0.1;
				if (low_speed < 0.1) low_speed = 0;
				if (high_speed < 0.1) high_speed = 0;
				if (interval_s_p_km < 1) interval_s_p_km = 0;
				target = {
					type: WAHOO_PLAN_TARGET_TYPE.SPEED,
					low: low_speed,
					high: high_speed
				};
				break;
			case WAHOO_PLAN_FAMILY_TYPE.BIKING:
				target = {
					type: WAHOO_PLAN_TARGET_TYPE.FTP,
					low: Number((interval.intensity - interval.intensity * 0.05).toFixed(2)),
					high: Number((interval.intensity + interval.intensity * 0.05).toFixed(2))
				};
				break;
			default:
				throw new Error('Unsupported activity type');
		}

		if (workout_type_family == WAHOO_PLAN_FAMILY_TYPE.BIKING)
			interval_name = `${(interval.intensity * user.bike_ftp).toFixed(0)}w`;
		if (workout_type_family == WAHOO_PLAN_FAMILY_TYPE.RUNNING)
			interval_name = `${secondsToHHMMSS(interval_s_p_km, false)}min/km`;
		const wahoo_interval: WAHOO_PLAN_INTERVALS = {
			name: interval_name,
			exit_trigger_type: WAHOO_PLAN_TRIGGER_TYPE.TIME,
			exit_trigger_value: interval.duration,
			intensity_type: getWahooIntervalIntensityType(interval.intensity),
			targets: [target]
		};
		intervals.push(wahoo_interval);
	}

	const res: WahooV1Plan = {
		header,
		intervals
	};
	console.log(JSON.stringify(res, null, 4));
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
