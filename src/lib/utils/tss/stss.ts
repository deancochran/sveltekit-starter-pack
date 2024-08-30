import { SportType } from '$lib/integrations/strava/typescript-fetch-client/models';

// const YARDS_PER_METER: number = 1.09361;
const METERSPER100m: number = 100;
// const YARDS_PER_100m: number = METERSPER100m*YARDS_PER_METER;
export const validSTssSportTypes = [SportType.Swim];

export function calcSwimPace(
	metersParam: number,
	secondsParam: number,
	unit: 'min' | 'sec' = 'sec'
) {
	// Calculate pace in minutes per 100 meters
	const total100Laps = metersParam / METERSPER100m;
	const elapsedMins = secondsParam / 60;
	if (unit == 'min') {
		const paceMinutesPer100m: number = elapsedMins / total100Laps;
		return paceMinutesPer100m;
	} else {
		const paceSecondsPer100m: number = secondsParam / total100Laps;
		return paceSecondsPer100m;
	}
}

export function calcSIF(NP: number, FTP: number) {
	return FTP / NP;
}

// TODO add yds to meters conversion
export function calcSTss(
	S: number,
	NGP: number,
	FTP: number,
	INTENSITY_FACTOR: number
) {
	// // Constants
	const MAX_HOUR_FTP_POWER_OUTPUT: number = FTP * 3600;
	// // Calculate rTSS
	const EFFORT_POWER_OUTPUT: number = S * (NGP * INTENSITY_FACTOR);
	const sTSS: number = (EFFORT_POWER_OUTPUT / MAX_HOUR_FTP_POWER_OUTPUT) * 100;
	return sTSS;
}

export function intensitySwimSpeed(
	intensity: number,
	swimFtp: number | undefined
): [display: string, value: number] {
	if (swimFtp === undefined) {
		return ['00:00/100m', 0];
	}
	let secP100m: number;

	if (intensity > 1) {
		secP100m = swimFtp - Math.round((intensity - 1) * swimFtp);
	} else {
		secP100m = swimFtp + Math.round((1 - intensity) * swimFtp);
	}
	return [
		`${Math.floor(secP100m / 60)
			.toString()
			.padStart(2, '0')}:${(secP100m % 60).toFixed(0).padStart(2, '0')}/100m`,
		secP100m
	];
}
