export function calcCIF(NP: number, FTP: number) {
	return NP / FTP;
}
export function calcCTss(
	S: number,
	NP: number,
	FTP: number,
	INTENSITY_FACTOR: number
) {
	// returns effort score 0-X (X>=100)
	const EFFORT_POWER_OUTPUT = S * NP * INTENSITY_FACTOR;
	const MAX_HOUR_FTP_POWER_OUTPUT = FTP * 3600;
	return (EFFORT_POWER_OUTPUT / MAX_HOUR_FTP_POWER_OUTPUT) * 100;
}

export function calcCTssFromIntervals(
	intervals: { duration: number; intensity: number }[]
) {
	// TODO calculate the avg intensity
	const avgIntensity =
		intervals.reduce((acc, cur) => acc + cur.intensity, 0) / intervals.length;
	// TODO calculate the total duration
	const totalDuration = intervals.reduce((acc, cur) => acc + cur.duration, 0);

	// calculate tss assuming ftp is 100 and NP = avgIntensity * ftp
	const FTP = 100;
	const NP = avgIntensity * FTP;

	// calculate cTSS
	const cTSS = calcCTss(totalDuration, NP, FTP, avgIntensity);
	return cTSS;
}

export function intensitBikeWatts(
	intensity: number,
	bikeW: number | undefined
): [display: string, value: number] {
	if (bikeW === undefined) {
		return ['0W', 0];
	}
	bikeW = bikeW * intensity;
	return [`${Math.floor(bikeW).toString().padStart(2, '0')}W`, 0];
}
