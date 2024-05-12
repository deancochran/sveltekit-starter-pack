export function calc_cIF(NP: number, FTP: number) {
	return NP / FTP;
}
export function calc_cTss(S: number, NP: number, FTP: number, INTENSITY_FACTOR: number) {
	// returns effort score 0-X (X>=100)
	const EFFORT_POWER_OUTPUT = S * NP * INTENSITY_FACTOR;
	const MAX_HOUR_FTP_POWER_OUTPUT = FTP * 3600;
	return (EFFORT_POWER_OUTPUT / MAX_HOUR_FTP_POWER_OUTPUT) * 100;
}

export function calc_cTss_from_intervals(intervals: { duration: number; intensity: number }[]) {
	// TODO calculate the avg intensity
	const avg_intensity = intervals.reduce((acc, cur) => acc + cur.intensity, 0) / intervals.length;
	// TODO calculate the total duration
	const total_duration = intervals.reduce((acc, cur) => acc + cur.duration, 0);

	// calculate tss assuming ftp is 100 and NP = avg_intensity * ftp
	const FTP = 100;
	const NP = avg_intensity * FTP;

	// calculate cTSS
	const cTSS = calc_cTss(total_duration, NP, FTP, avg_intensity);
	return cTSS;
}

export function intensity_to_bike_watts(
	intensity: number,
	cycling_ftp: number | undefined
): [display: string, value: number] {
	if (cycling_ftp === undefined) {
		return ['0W', 0];
	}
	const bike_W = cycling_ftp * intensity;
	return [`${Math.floor(bike_W).toString().padStart(2, '0')}W`, 0];
}
