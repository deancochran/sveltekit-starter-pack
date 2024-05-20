/* eslint-disable no-case-declarations */
import { calc_rIF, calc_rTss, intensity_to_run_speed } from '../tss/rtss';
import { calc_cIF, calc_cTss, intensity_to_bike_watts } from '../tss/ctss';
import { calc_sIF, calc_sTss, intensity_to_swim_speed } from '../tss/stss';
import { ActivityType } from '@prisma/client';
import type { User } from 'lucia';
import { secondsToHHMMSS } from '../datetime';
import type { training_session_schema } from '$lib/schemas';
import type { Infer } from 'sveltekit-superforms';

export type WorkoutInterval = {
	duration: number;
	intensity: number;
};

export type WorkoutSession = WorkoutInterval[];

function evaluateRunPlan(user: User, intervals: WorkoutInterval[]) {
	let stress_score = 0;
	for (const interval of intervals) {
		const user_speed = user.run_ftp * interval.intensity;
		// const distance = interval.duration *
		// const GAP = calcRunPace(interval.distance, interval.duration);
		const rIF = calc_rIF(user_speed, user.run_ftp);
		stress_score += calc_rTss(interval.duration, user_speed, user.run_ftp, rIF);
		break;
	}
	return stress_score < 1 ? 0 : stress_score;
}

function evaluateBikePlan(user: User, intervals: WorkoutInterval[]) {
	let stress_score = 0;
	for (const interval of intervals) {
		const NP = interval.intensity * user.bike_ftp;
		const cIF = calc_cIF(NP, user.bike_ftp);
		stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
	}
	return stress_score < 1 ? 0 : stress_score;
}

function evaluateSwimPlan(user: User, intervals: WorkoutInterval[]) {
	let stress_score = 0;

	for (const interval of intervals) {
		const user_speed =
			interval.intensity > 1
				? user.swim_ftp - Math.round((interval.intensity - 1) * user.swim_ftp) // running beyond ftp means faster pace
				: Math.round(user.swim_ftp * interval.intensity); // running under ftp means slower pace
		// const distance = mps * interval.duration;
		// const GAP = calcSwimPace(distance, interval.duration);
		const sIF = calc_sIF(user_speed, user.swim_ftp);
		stress_score += calc_sTss(interval.duration, user_speed, user.swim_ftp, sIF);
	}

	return stress_score < 1 ? 0 : stress_score;
}

export type PlanStats = {
	stress_score: number;
	distance: number;
	duration: number;
};
export function evaluatePlanTss(
	user: User | undefined,
	activity_type: ActivityType,
	intervals: WorkoutInterval[]
): PlanStats {
	if (!user) return { stress_score: 0, distance: 0, duration: 0 };
	let stress_score: number;
	switch (activity_type) {
		case ActivityType.RUN:
			stress_score = Math.round(evaluateRunPlan(user, intervals));
			return { stress_score, distance: 0, duration: 0 };
		case ActivityType.BIKE:
			stress_score = Math.round(evaluateBikePlan(user, intervals));
			return { stress_score, distance: 0, duration: 0 };
		case ActivityType.SWIM:
			stress_score = Math.round(evaluateSwimPlan(user, intervals));
			return { stress_score, distance: 0, duration: 0 };

		default:
			return { stress_score: 0, distance: 0, duration: 0 };
	}
}

export function calculateAvgWatts(user: User | undefined, plan: WorkoutInterval[]): number {
	//if no user return 0
	if (!user) {
		return 0;
	}
	if (plan.length === 0) {
		return 0;
	}

	let totalWatts = 0;
	plan.forEach((i) => {
		totalWatts += i.intensity * user.bike_ftp;
	});
	return totalWatts / plan.length;
}

export function getIntensityDisplay(
	intensity: number,
	activity_type: string,
	user: User | undefined
): [display: string, value: number] {
	if (!user) throw new Error('User not defined.');
	switch (activity_type) {
		case ActivityType.SWIM:
			return intensity_to_swim_speed(intensity, user.swim_ftp);
		case ActivityType.RUN:
			return intensity_to_run_speed(intensity, user.run_ftp);
		case ActivityType.BIKE:
			return intensity_to_bike_watts(intensity, user.bike_ftp);
	}
	throw new Error('Function not implemented.');
}

export function getIntervalDisplay(
	interval: WorkoutInterval,
	activity_type: string,
	user: User | undefined
) {
	if (!user) throw new Error('User not defined.');

	switch (activity_type) {
		case ActivityType.SWIM:
			const [swim_intensity_display, s_p_100m] = getIntensityDisplay(
				interval.intensity,
				activity_type,
				user
			);

			const swim_distance = (interval.duration / s_p_100m) * 100;
			return `${swim_distance}m at ${swim_intensity_display}`;
		case ActivityType.RUN:
			// eslint-disable-next-line no-case-declarations
			const [run_intensity_display, s_p_km] = getIntensityDisplay(
				interval.intensity,
				activity_type,
				user
			);

			const run_distance = (interval.duration / s_p_km) * 1000;
			return `${run_distance}km at ${run_intensity_display}`;
		case ActivityType.BIKE:
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const [bike_intensity_display, bike_watts] = getIntensityDisplay(
				interval.intensity,
				activity_type,
				user
			);
			const bike_duration = secondsToHHMMSS(interval.duration);
			return `${bike_intensity_display} for ${bike_duration}`;
	}
}

export function calculateDistance(
	data: Infer<typeof training_session_schema>,
	user: User | undefined = undefined
) {
	if (!user) return '0km';
	switch (data.activity_type) {
		case ActivityType.SWIM:
			const swim_distance = data.plan.reduce(
				(distance: number, interval: { duration: number; intensity: number; }) =>
					distance +
					(interval.duration /
						getIntensityDisplay(interval.intensity, ActivityType.SWIM, user)[1]) *
						100,
				0
			);
			return swim_distance.toFixed(0) + 'm';
		case ActivityType.RUN:
			const run_distance = data.plan.reduce(
				(distance: number, interval: { duration: number; intensity: number; }) =>
					distance +
					(interval.duration /
						getIntensityDisplay(interval.intensity, ActivityType.RUN, user)[1]) *
						1000,
				0
			);
			return run_distance.toFixed(2) + 'km';
		case ActivityType.BIKE:
			throw new Error('Function not implemented.');
	}
}
