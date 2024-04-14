import { calcRunPace, calc_rIF, calc_rTss } from '../tss/rtss';
import { calc_cIF, calc_cTss } from '../tss/ctss';
import { calcSwimPace, calc_sIF, calc_sTss } from '../tss/stss';
import { ActivityType } from '@prisma/client';
import type { User } from 'lucia';

export enum IntervalType {
	RAMP = 'ramp',
	BLOCK = 'block'
}

export type Interval = {
	duration: number;
	distance: number;
};

export type RampInterval = Interval & {
	interval_type: IntervalType.RAMP;
	start_intensity: number;
	end_intensity: number;
};
export type BlockInterval = Interval & {
	interval_type: IntervalType.BLOCK;
	intensity: number;
};
export type WorkoutInterval = RampInterval | BlockInterval;
export type WorkoutSession = WorkoutInterval[];

function evaluateRunPlan(user: User, intervals: WorkoutInterval[]) {
	let stress_score = 0;
	for (const interval of intervals) {
		if (interval.duration) {
			switch (interval.interval_type) {
				case IntervalType.BLOCK: {
					const GAP = calcRunPace(interval.distance, interval.duration);
					const rIF = calc_rIF(GAP, user.run_ftp);
					stress_score += calc_rTss(interval.duration, GAP, user.run_ftp, rIF);
					break;
				}
				case IntervalType.RAMP: {
					const GAP = calcRunPace(interval.distance, interval.duration);
					const rIF = calc_rIF(GAP, user.run_ftp);
					stress_score += calc_rTss(interval.duration, GAP, user.run_ftp, rIF);
					break;
				}
			}
		}
	}
	return stress_score < 1 ? 0 : stress_score;
}

function evaluateBikePlan(user: User, intervals: WorkoutInterval[]) {
	let stress_score = 0;
	for (const interval of intervals) {
		if (interval.duration) {
			switch (interval.interval_type) {
				case IntervalType.BLOCK: {
					const NP = interval.intensity * user.bike_ftp;
					const cIF = calc_cIF(NP, user.bike_ftp);
					stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
					break;
				}
				case IntervalType.RAMP: {
					const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
					const NP = avg_intensity * user.bike_ftp;
					const cIF = calc_cIF(NP, user.bike_ftp);
					stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
					break;
				}
			}
		}
	}
	return stress_score < 1 ? 0 : stress_score;
}

function evaluateSwimPlan(user: User, intervals: WorkoutInterval[]) {
	let stress_score = 0;

	for (const [index, interval] of intervals.entries()) {
		if (interval.duration) {
			switch (interval.interval_type) {
				case IntervalType.BLOCK: {
					const GAP = calcSwimPace(interval.distance, interval.duration);
					const sIF = calc_sIF(GAP, user.swim_ftp);
					const stressScore = calc_sTss(interval.duration, sIF);
					stress_score += stressScore;
					console.log('index', index, stressScore);

					break;
				}
				case IntervalType.RAMP: {
					const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
					const mps =
						avg_intensity > 1
							? user.swim_ftp - Math.round((avg_intensity - 1) * user.swim_ftp) // running beyond ftp means faster pace
							: Math.round(user.swim_ftp * avg_intensity); // running under ftp means slower pace
					const distance = mps * interval.duration;
					const GAP = calcSwimPace(distance, interval.duration);
					const sIF = calc_sIF(GAP, user.swim_ftp);
					stress_score += calc_sTss(interval.duration, sIF);

					break;
				}
			}
		}
	}

	return stress_score < 1 ? 0 : stress_score;
}

export function evaluatePlanTss(
	user: User | undefined,
	activity_type: ActivityType,
	intervals: WorkoutInterval[]
) {
	if (!user) return 0;
	console.log('evaluatePlanTss');
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
		if (user) {
			if (i.interval_type === IntervalType.RAMP) {
				const avg_intensity = (i.start_intensity + i.end_intensity) / 2;
				totalWatts += avg_intensity * user.bike_ftp;
			} else {
				totalWatts += i.intensity * user.bike_ftp;
			}
		}
	});
	return totalWatts / plan.length;
}
