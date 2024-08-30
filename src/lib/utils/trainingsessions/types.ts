import type { trainingSessionSchema } from '$lib/schemas';
import type { User } from 'lucia';
import type { Infer } from 'sveltekit-superforms';
import { secondsToHHMMSS } from '../datetime';
import { calcCIF, calcCTss, intensitBikeWatts } from '../tss/ctss';
import { calcRIF, calcRTss, intensityRunSpeed } from '../tss/rtss';
import { calcSIF, calcSTss, intensitySwimSpeed } from '../tss/stss';

export type WorkoutInterval = {
	duration: number;
	intensity: number;
};

export type WorkoutSession = WorkoutInterval[];

function evaluateRunPlan(user: User, intervals: WorkoutInterval[]) {
	let stressScore = 0;
	for (const interval of intervals) {
		const userSpeed = user.runFtp * interval.intensity;
		// const distance = interval.duration *
		// const GAP = calcRunPace(interval.distance, interval.duration);
		const rIF = calcRIF(userSpeed, user.runFtp);
		stressScore += calcRTss(interval.duration, userSpeed, user.runFtp, rIF);
		break;
	}
	return stressScore < 1 ? 0 : stressScore;
}

function evaluateBikePlan(user: User, intervals: WorkoutInterval[]) {
	let stressScore = 0;
	for (const interval of intervals) {
		const NP = interval.intensity * user.bikeFtp;
		const cIF = calcCIF(NP, user.bikeFtp);
		stressScore += calcCTss(interval.duration, NP, user.bikeFtp, cIF);
	}
	return stressScore < 1 ? 0 : stressScore;
}

function evaluateSwimPlan(user: User, intervals: WorkoutInterval[]) {
	let stressScore = 0;

	for (const interval of intervals) {
		const userSpeed =
			interval.intensity > 1
				? user.swimFtp - Math.round((interval.intensity - 1) * user.swimFtp) // running beyond ftp means faster pace
				: Math.round(user.swimFtp * interval.intensity); // running under ftp means slower pace
		// const distance = mps * interval.duration;
		// const GAP = calcSwimPace(distance, interval.duration);
		const sIF = calcSIF(userSpeed, user.swimFtp);
		stressScore += calcSTss(interval.duration, userSpeed, user.swimFtp, sIF);
	}

	return stressScore < 1 ? 0 : stressScore;
}

export type PlanStats = {
	stressScore: number;
	distance: number;
	duration: number;
};
export function evaluatePlanTss(
	user: User | undefined,
	activityType: 'BIKE' | 'SWIM' | 'RUN',
	intervals: WorkoutInterval[]
): PlanStats {
	if (!user) return { stressScore: 0, distance: 0, duration: 0 };
	let stressScore: number;
	switch (activityType) {
		case 'RUN':
			stressScore = Math.round(evaluateRunPlan(user, intervals));
			return { stressScore, distance: 0, duration: 0 };
		case 'BIKE':
			stressScore = Math.round(evaluateBikePlan(user, intervals));
			return { stressScore, distance: 0, duration: 0 };
		case 'SWIM':
			stressScore = Math.round(evaluateSwimPlan(user, intervals));
			return { stressScore, distance: 0, duration: 0 };

		default:
			return { stressScore: 0, distance: 0, duration: 0 };
	}
}

export function calculateAvgWatts(
	user: User | undefined,
	plan: WorkoutInterval[]
): number {
	//if no user return 0
	if (!user) {
		return 0;
	}
	if (plan.length === 0) {
		return 0;
	}

	let totalWatts = 0;
	plan.forEach((i) => {
		totalWatts += i.intensity * user.bikeFtp;
	});
	return totalWatts / plan.length;
}

export function getIntensityDisplay(
	intensity: number,
	activityType: string,
	user: User | undefined
): [display: string, value: number] {
	if (!user) throw new Error('User not defined.');
	switch (activityType) {
		case 'SWIM':
			return intensitySwimSpeed(intensity, user.swimFtp);
		case 'RUN':
			return intensityRunSpeed(intensity, user.runFtp);
		case 'BIKE':
			return intensitBikeWatts(intensity, user.bikeFtp);
	}
	throw new Error('Function not implemented.');
}

export function getIntervalDisplay(
	interval: WorkoutInterval,
	activityType: string,
	user: User | undefined
) {
	if (!user) throw new Error('User not defined.');

	switch (activityType) {
		case 'SWIM':
			const [swimIntensityDisplay, sP100m] = getIntensityDisplay(
				interval.intensity,
				activityType,
				user
			);

			const swimDistance = (interval.duration / sP100m) * 100;
			return `${swimDistance}m at ${swimIntensityDisplay}`;
		case 'RUN':
			const [runIntensityDisplay, sPKm] = getIntensityDisplay(
				interval.intensity,
				activityType,
				user
			);

			const runDistance = (interval.duration / sPKm) * 1000;
			return `${runDistance}km at ${runIntensityDisplay}`;
		case 'BIKE':
			let [display] = getIntensityDisplay(
				interval.intensity,
				activityType,
				user
			);
			display = secondsToHHMMSS(interval.duration);
			return `${display} for ${display}`;
	}
}

export function calculateDistance(
	data: Infer<typeof trainingSessionSchema>,
	user: User | undefined = undefined
) {
	if (!user) return '0km';
	switch (data.activityType) {
		case 'SWIM':
			const swimDistance = data.plan.reduce(
				(distance: number, interval: { duration: number; intensity: number }) =>
					distance +
					(interval.duration /
						getIntensityDisplay(interval.intensity, 'SWIM', user)[1]) *
						100,
				0
			);
			return swimDistance.toFixed(0) + 'm';
		case 'RUN':
			const runDistance = data.plan.reduce(
				(distance: number, interval: { duration: number; intensity: number }) =>
					distance +
					(interval.duration /
						getIntensityDisplay(interval.intensity, 'RUN', user)[1]) *
						1000,
				0
			);
			return runDistance.toFixed(2) + 'km';
		case 'BIKE':
			throw new Error('Function not implemented.');
	}
}
