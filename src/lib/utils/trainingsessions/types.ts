
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

// export function evaluateRunPlan(user: User, intervals: WorkoutInterval[]) {
// 	let stress_score = 0;
// 	let totalDuration = 0;
// 	let totalDistance = 0;
// 	for (const interval of intervals) {
// 		switch (interval.interval_type) {
// 			case IntervalType.BLOCK: {
// 				const kps =
// 					interval.intensity > 1
// 						? user.run_ftp - Math.round((interval.intensity - 1) * user.run_ftp) // running beyond ftp means faster pace
// 						: Math.round(user.run_ftp * interval.intensity); // running under ftp means slower pace
// 				const distance = kps * interval.duration;
// 				const GAP = calcRunPace(distance, interval.duration);
// 				const rIF = calc_rIF(GAP, user.run_ftp);
// 				stress_score += calc_rTss(interval.duration, GAP, user.run_ftp, rIF);
// 				totalDuration += interval.duration;
// 				totalDistance += distance;
// 				break;
// 			}
// 			case IntervalType.RAMP: {
// 				const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
// 				const kps =
// 					avg_intensity > 1
// 						? user.run_ftp - Math.round((avg_intensity - 1) * user.run_ftp) // running beyond ftp means faster pace
// 						: Math.round(user.run_ftp * avg_intensity); // running under ftp means slower pace
// 				const distance = kps * interval.duration;
// 				const GAP = calcRunPace(distance, interval.duration);
// 				const rIF = calc_rIF(GAP, user.run_ftp);
// 				stress_score += calc_rTss(interval.duration, GAP, user.run_ftp, rIF);
// 				totalDuration += interval.duration;
// 				totalDistance += distance;
// 				break;
// 			}
// 		}
// 	}
// 	return { stress_score, totalDuration, totalDistance };
// }

// //
// export function evaluateBikePlan(user: User, intervals: WorkoutInterval[]) {
// 	let stress_score = 0;
// 	let totalDuration = 0;
// 	// eslint-disable-next-line prefer-const
// 	let totalDistance = 0;
// 	for (const interval of intervals) {
// 		switch (interval.interval_type) {
// 			case IntervalType.BLOCK: {
// 				const NP = interval.intensity * user.bike_ftp;
// 				const cIF = calc_cIF(NP, user.bike_ftp);
// 				stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
// 				totalDuration += interval.duration;
// 				// totalDistance += distance;
// 				break;
// 			}

// 			// TODO update this to be more accurate and scientific
// 			case IntervalType.RAMP: {
// 				const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
// 				const NP = avg_intensity * user.bike_ftp;
// 				const cIF = calc_cIF(NP, user.bike_ftp);
// 				stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
// 				totalDuration += interval.duration;
// 				// totalDistance += distance;
// 				break;
// 			}
// 		}
// 	}
// 	return { stress_score, totalDuration, totalDistance };
// }

// export function evaluateSwimPlan(user: User, intervals: WorkoutInterval[]) {
// 	let stress_score = 0;
// 	let totalDuration = 0;
// 	let totalDistance = 0;
// 	for (const interval of intervals) {
// 		switch (interval.interval_type) {
// 			case IntervalType.BLOCK: {
// 				const mps =
// 					interval.intensity > 1
// 						? user.swim_ftp - Math.round((interval.intensity - 1) * user.swim_ftp) // running beyond ftp means faster pace
// 						: Math.round(user.swim_ftp * interval.intensity); // running under ftp means slower pace
// 				const distance = mps * interval.duration;
// 				const GAP = calcSwimPace(distance, interval.duration);
// 				const sIF = calc_sIF(GAP, user.swim_ftp);
// 				stress_score += calc_sTss(interval.duration, sIF);
// 				totalDuration += interval.duration;
// 				totalDistance += distance;
// 				break;
// 			}
// 			case IntervalType.RAMP: {
// 				const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
// 				const mps =
// 					avg_intensity > 1
// 						? user.swim_ftp - Math.round((avg_intensity - 1) * user.swim_ftp) // running beyond ftp means faster pace
// 						: Math.round(user.swim_ftp * avg_intensity); // running under ftp means slower pace
// 				const distance = mps * interval.duration;
// 				const GAP = calcSwimPace(distance, interval.duration);
// 				const sIF = calc_sIF(GAP, user.swim_ftp);
// 				stress_score += calc_sTss(interval.duration, sIF);
// 				totalDuration += interval.duration;
// 				totalDistance += distance;
// 				break;
// 			}
// 		}
// 	}
// 	return { stress_score, totalDuration, totalDistance };
// }

// export function evaluatePlan(
// 	user: User,
// 	activity_type: ActivityType,
// 	intervals: WorkoutInterval[]
// ) {
// 	switch (activity_type) {
// 		case ActivityType.RUN:
// 			return evaluateRunPlan(user, intervals);
// 		case ActivityType.BIKE:
// 			return evaluateBikePlan(user, intervals);
// 		case ActivityType.SWIM:
// 			return evaluateSwimPlan(user, intervals);
// 		default:
// 			return { stress_score: 0, totalDuration: 0, totalDistance: 0 };
// 	}
// }

// export function evaluateInterval(
// 	user: User | undefined,
// 	activity_type: ActivityType,
// 	interval: WorkoutInterval
// ): { stress_score: number; distance: number; duration: number } {
// 	if (!user) return { stress_score: 0, distance: 0, duration: 0 };
// 	switch (activity_type) {
// 		case ActivityType.RUN:
// 			return evaluateRunInterval(user, interval);
// 		case ActivityType.BIKE:
// 			return evaluateBikeInterval(user, interval);
// 		case ActivityType.SWIM:
// 			return evaluateSwimInterval(user, interval);
// 		default:
// 			return { stress_score: 0, distance: 0, duration: 0 };
// 	}
// }

// export function evaluateRunInterval(user: User, interval: WorkoutInterval) {
// 	let stress_score = 0;
// 	let totalDuration = 0;
// 	let totalDistance = 0;
// 	switch (interval.interval_type) {
// 		case IntervalType.BLOCK: {
// 			const kps =
// 				interval.intensity > 1
// 					? user.run_ftp - Math.round((interval.intensity - 1) * user.run_ftp) // running beyond ftp means faster pace
// 					: Math.round(user.run_ftp * interval.intensity); // running under ftp means slower pace
// 			const distance = kps * interval.duration;
// 			const GAP = calcRunPace(distance, interval.duration);
// 			const rIF = calc_rIF(GAP, user.run_ftp);
// 			stress_score += calc_rTss(interval.duration, GAP, user.run_ftp, rIF);
// 			totalDuration += interval.duration;
// 			totalDistance += distance;
// 			break;
// 		}
// 		case IntervalType.RAMP: {
// 			const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
// 			const kps =
// 				avg_intensity > 1
// 					? user.run_ftp - Math.round((avg_intensity - 1) * user.run_ftp) // running beyond ftp means faster pace
// 					: Math.round(user.run_ftp * avg_intensity); // running under ftp means slower pace
// 			const distance = kps * interval.duration;
// 			const GAP = calcRunPace(distance, interval.duration);
// 			const rIF = calc_rIF(GAP, user.run_ftp);
// 			stress_score += calc_rTss(interval.duration, GAP, user.run_ftp, rIF);
// 			totalDuration += interval.duration;
// 			totalDistance += distance;
// 			break;
// 		}
// 	}
// 	return { stress_score, duration: totalDuration, distance: totalDistance };
// }

// export function evaluateBikeInterval(user: User, interval: WorkoutInterval) {
// 	let stress_score = 0;
// 	let totalDuration = 0;
// 	// eslint-disable-next-line prefer-const
// 	let totalDistance = 0;

// 	switch (interval.interval_type) {
// 		case IntervalType.BLOCK: {
// 			const NP = interval.intensity * user.bike_ftp;
// 			const cIF = calc_cIF(NP, user.bike_ftp);
// 			stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
// 			totalDuration += interval.duration;
// 			// totalDistance += distance;
// 			break;
// 		}

// 		// TODO update this to be more accurate and scientific
// 		case IntervalType.RAMP: {
// 			const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
// 			const NP = avg_intensity * user.bike_ftp;
// 			const cIF = calc_cIF(NP, user.bike_ftp);
// 			stress_score += calc_cTss(interval.duration, NP, user.bike_ftp, cIF);
// 			totalDuration += interval.duration;
// 			// totalDistance += distance;
// 			break;
// 		}
// 	}
// 	return { stress_score, duration: totalDuration, distance: totalDistance };
// }

// export function evaluateSwimInterval(user: User, interval: WorkoutInterval) {
// 	let stress_score = 0;
// 	let totalDuration = 0;
// 	let totalDistance = 0;
// 	switch (interval.interval_type) {
// 		case IntervalType.BLOCK: {
// 			const mps =
// 				interval.intensity > 1
// 					? user.swim_ftp - Math.round((interval.intensity - 1) * user.swim_ftp) // running beyond ftp means faster pace
// 					: Math.round(user.swim_ftp * interval.intensity); // running under ftp means slower pace
// 			const distance = mps * interval.duration;
// 			const GAP = calcSwimPace(distance, interval.duration);
// 			const sIF = calc_sIF(GAP, user.swim_ftp);
// 			stress_score += calc_sTss(interval.duration, sIF);
// 			totalDuration += interval.duration;
// 			totalDistance += distance;
// 			break;
// 		}
// 		case IntervalType.RAMP: {
// 			const avg_intensity = (interval.start_intensity + interval.end_intensity) / 2;
// 			const mps =
// 				avg_intensity > 1
// 					? user.swim_ftp - Math.round((avg_intensity - 1) * user.swim_ftp) // running beyond ftp means faster pace
// 					: Math.round(user.swim_ftp * avg_intensity); // running under ftp means slower pace
// 			const distance = mps * interval.duration;
// 			const GAP = calcSwimPace(distance, interval.duration);
// 			const sIF = calc_sIF(GAP, user.swim_ftp);
// 			stress_score += calc_sTss(interval.duration, sIF);
// 			totalDuration += interval.duration;
// 			totalDistance += distance;
// 			break;
// 		}
// 	}
// 	return { stress_score, duration: totalDuration, distance: totalDistance };
// }
