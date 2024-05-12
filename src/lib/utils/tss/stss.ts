import { SportType } from '../integrations/strava/typescript-fetch-client/models';

// const YARDS_PER_METER: number = 1.09361;
const METERS_PER_100m: number = 100;
// const YARDS_PER_100m: number = METERS_PER_100m*YARDS_PER_METER;
export const valid_sTss_sport_types = [SportType.Swim];

export function calcSwimPace(
	metersParam: number,
	secondsParam: number,
	unit: 'min' | 'sec' = 'sec'
) {
	// Calculate pace in minutes per 100 meters
	const total_100_laps = metersParam / METERS_PER_100m;
	const elapsed_mins = secondsParam / 60;
	if (unit == 'min') {
		const paceMinutesPer100m: number = elapsed_mins / total_100_laps;
		return paceMinutesPer100m;
	} else {
		const paceSecondsPer100m: number = secondsParam / total_100_laps;
		return paceSecondsPer100m;
	}
}

export function calc_sIF(NP: number, FTP: number) {
	return FTP / NP;
}

// TODO add yds to meters conversion
export function calc_sTss(S: number, NGP: number, FTP: number, INTENSITY_FACTOR: number) {
	// // Constants
	const MAX_HOUR_FTP_POWER_OUTPUT: number = FTP * 3600;
	// // Calculate rTSS
	const EFFORT_POWER_OUTPUT: number = S * (NGP * INTENSITY_FACTOR);
	const sTSS: number = (EFFORT_POWER_OUTPUT / MAX_HOUR_FTP_POWER_OUTPUT) * 100;
	return sTSS;
}

export function intensity_to_swim_speed(intensity: number, swim_ftp:number|undefined): [display:string, value:number] {
	if (swim_ftp === undefined) {
		return ['00:00/100m', 0];
	}
	let sec_p_100m: number

	if (intensity > 1) {
		sec_p_100m = swim_ftp - Math.round((intensity - 1) * swim_ftp);
	} else {
		sec_p_100m = swim_ftp + Math.round((1 - intensity) * swim_ftp);
	}
	return [`${Math.floor(sec_p_100m / 60).toString().padStart(2, '0')}:${(sec_p_100m % 60).toFixed(0).padStart(2, '0')}/100m`, sec_p_100m];
}
