import type { trainingSession, user } from '$lib/drizzle/schema';
import { secondsToHHMMSS } from '$lib/utils/datetime';
import { type WorkoutSession } from '$lib/utils/trainingsessions/types';
import type { InferSelectModel } from 'drizzle-orm';
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
	_user: User | InferSelectModel<typeof user>,
	_trainingSession: InferSelectModel<typeof trainingSession>
): WahooV1Plan {
	let workoutTypeFamily: number;

	if (_trainingSession.activityType === 'RUN') {
		if (!_user.runFtp) throw new Error('no run ftp');
		workoutTypeFamily = WAHOO_PLAN_FAMILY_TYPE.RUNNING;
	} else if (_trainingSession.activityType === 'BIKE') {
		if (!_user.bikeFtp) throw new Error('no bike ftp');
		workoutTypeFamily = WAHOO_PLAN_FAMILY_TYPE.BIKING;
	} else {
		throw new Error('Unsupported activity type');
	}
	const header: WahooV1Plan['header'] = {
		name: _trainingSession.title,
		version: '1.0.0',
		// description: (trainingSession.description ?? undefined,
		workout_type_family: workoutTypeFamily
		// workout_type_location: WAHOO_PLAN_WORKOUT_TYPE_LOCATION.INDOOR
	};
	if (workoutTypeFamily == WAHOO_PLAN_FAMILY_TYPE.BIKING)
		header['ftp'] = _user.bikeFtp;
	const intervals: WahooV1Plan['intervals'] = [];
	const workoutIntervals = _trainingSession.plan as WorkoutSession;
	for (let i = 0; i < workoutIntervals.length; i++) {
		let intervalName: string = '';
		let intervalSPKm: number = 0;
		let target;
		const interval = workoutIntervals[i];
		let lowSpeed: number;
		let highSpeed: number;
		switch (workoutTypeFamily) {
			case WAHOO_PLAN_FAMILY_TYPE.RUNNING:
				if (interval.intensity > 1) {
					intervalSPKm = Number(
						_user.runFtp - (interval.intensity - 1) * _user.runFtp
					);
				} else {
					intervalSPKm = Number(
						_user.runFtp + (1 - interval.intensity) * _user.runFtp
					);
				}
				lowSpeed = 1000 / intervalSPKm - 0.1;
				highSpeed = 1000 / intervalSPKm + 0.1;
				if (lowSpeed < 0.1) lowSpeed = 0;
				if (highSpeed < 0.1) highSpeed = 0;
				if (intervalSPKm < 1) intervalSPKm = 0;
				target = {
					type: WAHOO_PLAN_TARGET_TYPE.SPEED,
					low: lowSpeed,
					high: highSpeed
				};
				break;
			case WAHOO_PLAN_FAMILY_TYPE.BIKING:
				target = {
					type: WAHOO_PLAN_TARGET_TYPE.FTP,
					low: Number(
						(interval.intensity - interval.intensity * 0.05).toFixed(2)
					),
					high: Number(
						(interval.intensity + interval.intensity * 0.05).toFixed(2)
					)
				};
				break;
			default:
				throw new Error('Unsupported activity type');
		}

		if (workoutTypeFamily == WAHOO_PLAN_FAMILY_TYPE.BIKING)
			intervalName = `${(interval.intensity * _user.bikeFtp).toFixed(0)}w`;
		if (workoutTypeFamily == WAHOO_PLAN_FAMILY_TYPE.RUNNING)
			intervalName = `${secondsToHHMMSS(intervalSPKm, false)}min/km`;
		const wahooInterval: WAHOO_PLAN_INTERVALS = {
			name: intervalName,
			exit_trigger_type: WAHOO_PLAN_TRIGGER_TYPE.TIME,
			exit_trigger_value: interval.duration,
			intensity_type: getWahooIntervalIntensityType(interval.intensity),
			targets: [target]
		};
		intervals.push(wahooInterval);
	}

	const res: WahooV1Plan = {
		header,
		intervals
	};
	console.log(JSON.stringify(res, null, 4));
	return res;
}

export function getWahooWorkoutIdFromTrainingSessionType(
	activityType: 'RUN' | 'BIKE' | 'SWIM'
) {
	switch (activityType) {
		case 'RUN':
			return WahooWorkoutTypeID.RUNNING;
		case 'BIKE':
			return WahooWorkoutTypeID.BIKING;
		case 'SWIM':
			return WahooWorkoutTypeID.SWIMMING_LAP;
		default:
			throw new Error('Unsupported activity type');
	}
}
