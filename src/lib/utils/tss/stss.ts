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
export function calc_sTss(S: number, NP: number, FTP: number, INTENSITY_FACTOR: number) {
	// Convert paces to speeds (yards per minute or meters per minute)
	// swim ftp give in best seconds/(100m/100yd) pace that you can hold over 1 hour
	const elapsed_hrs = S / 60 / 60;
	// Calculate Swim TSS
	return Math.pow(INTENSITY_FACTOR, 3) * elapsed_hrs * 100;
}
