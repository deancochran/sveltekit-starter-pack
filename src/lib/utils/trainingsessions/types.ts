import { calc_rIF, calc_rTss } from '../tss/rtss';
import { calc_cIF, calc_cTss } from '../tss/ctss';
import { calc_sIF, calc_sTss } from '../tss/stss';
import { ActivityType } from '@prisma/client';
import type { User } from 'lucia';

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
		stress_score += calc_sTss(interval.duration, sIF);
	}

	return stress_score < 1 ? 0 : stress_score;
}

export type PlanStats = {
	stress_score: number;
	distance: number;
	duration: number;
}
export function evaluatePlanTss(
	user: User | undefined,
	activity_type: ActivityType,
	intervals: WorkoutInterval[]
): PlanStats {
	if (!user) return 0;
	switch (activity_type) {
		case ActivityType.RUN:
			return evaluateRunPlan(user, intervals);
		case ActivityType.BIKE:
			return evaluateBikePlan(user, intervals);
		case ActivityType.SWIM:
			return evaluateSwimPlan(user, intervals);
		default:
			return 0;
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
