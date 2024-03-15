export function calc_cIF(NP: number, FTP: number) {
	return NP / FTP;
}
export function calc_cTss(S: number, NP: number, FTP: number, INTENSITY_FACTOR: number) {
	// returns effort score 0-X (X>=100)
	const EFFORT_POWER_OUTPUT = S * NP * INTENSITY_FACTOR;
	const MAX_HOUR_FTP_POWER_OUTPUT = FTP * 3600;
	return (EFFORT_POWER_OUTPUT / MAX_HOUR_FTP_POWER_OUTPUT) * 100;
}
