// TODO replace intensity rate with an equation to calculate a dynamic rate base on the clients needs
export enum TrainingIntensityDistribution {
	pyramidal = 'pyramidal',
	polarized = 'polarized',
	balanced = 'balanced'
}

export enum TrainingPlanPhase {
	BASE = 'base',
	BUILD = 'build',
	PEAK = 'peak',
	TAPER = 'taper'
}

export const TrainingPlanPhasePercentages = {
	[TrainingPlanPhase.BASE]: 0.5,
	[TrainingPlanPhase.BUILD]: 0.25,
	[TrainingPlanPhase.PEAK]: 0.15,
	[TrainingPlanPhase.TAPER]: 0.05
};

// these percentages MUST add up to 1 and dictate the intended intensity of work over a single microcycle
// THIS IS PYRAMIDAL
// const low_intensity_rate = 0.75;
// const mid_intensity_rate = 0.15;
// const high_intensity_rate = 0.1;

export enum Zone {
	zone1 = 'zone1',
	zone2 = 'zone2',
	zone3 = 'zone3',
	zone4 = 'zone4',
	zone5 = 'zone5',
	zone6 = 'zone6',
	zone7 = 'zone7'
}

// percentages of FTP
const zone1_max_ftp = 0.6;
const zone2_max_ftp = 0.75; //LT1
const zone3_max_ftp = 0.9;
const zone4_max_ftp = 1.05; //LT2
const zone5_max_ftp = 1.2;
const zone6_max_ftp = 1.35;

export type FtpZones = {
	[Zone.zone1]: { min: number; max: number };
	[Zone.zone2]: { min: number; max: number };
	[Zone.zone3]: { min: number; max: number };
	[Zone.zone4]: { min: number; max: number };
	[Zone.zone5]: { min: number; max: number };
	[Zone.zone6]: { min: number; max: number };
	[Zone.zone7]: { min: number; max: number };
};

export const FtpZoneDescriptions = {
	[Zone.zone1]: 'Active Recovery',
	[Zone.zone2]: 'Extensive Aerobic',
	[Zone.zone3]: 'Intensive Aerobic',
	[Zone.zone4]: 'Lactate Threshold',
	[Zone.zone5]: 'Vo2 Max Aerobic Capacity',
	[Zone.zone6]: 'VLa Max Anerobic Capacity',
	[Zone.zone7]: 'Neuromuscular Power'
};
// percentages of HR
const zone1_max_hr = 0.6;
const zone2_max_hr = 0.7; //LT1
const zone3_max_hr = 0.8;
const zone4_max_hr = 0.9; //LT2
const zone5_max_hr = 1;

export type HRZones = {
	[Zone.zone1]: { min: number; max: number };
	[Zone.zone2]: { min: number; max: number };
	[Zone.zone3]: { min: number; max: number };
	[Zone.zone4]: { min: number; max: number };
	[Zone.zone5]: { min: number; max: number };
};

/**
 * Calculates the number of days between two dates.
 *
 * @param {Date} date - The starting date.
 * @param {Date} targetDate - The target date.
 * @return {number} The number of days between the two dates.
 */
export const daysBetween = (date: Date, targetDate: Date) => {
	const diff = Math.abs(date.getTime() - targetDate.getTime());
	return Math.ceil(diff / (1000 * 3600 * 24));
};

/**
 * Calculates the number of days between the current date and the given target date.
 *
 * @param {Date} targetDate - The target date to calculate the days between.
 * @return {number} The number of days between the current date and the target date.
 */
export const daysBetweenNowAnd = (targetDate: Date) => {
	return daysBetween(new Date(), targetDate);
};

/**
 * Calculates the number of days in the base phase based on the start and end dates.
 *
 * @param {Date} startDate - the start date of the phase
 * @param {Date} endDate - the end date of the phase
 * @return {number} the number of days in the base phase
 */
export const daysInBasePhase = (startDate: Date, endDate: Date) => {
	const availableTrainingDays = daysBetween(startDate, endDate);
	return Math.ceil(availableTrainingDays * TrainingPlanPhasePercentages[TrainingPlanPhase.BASE]);
};

/**
 * Calculate the number of days in the building phase based on the start and end dates.
 *
 * @param {Date} startDate - the start date of the phase
 * @param {Date} endDate - the end date of the phase
 * @return {number} the number of days in the building phase
 */
export const daysInBuildingPhase = (startDate: Date, endDate: Date) => {
	const availableTrainingDays = daysBetween(startDate, endDate);
	return Math.ceil(availableTrainingDays * TrainingPlanPhasePercentages[TrainingPlanPhase.BUILD]);
};

/**
 * Calculates the number of days in the peak phase between the given start and end dates.
 *
 * @param {Date} startDate - The start date of the phase.
 * @param {Date} endDate - The end date of the phase.
 * @return {number} The total number of days in the peak phase.
 */
export const daysInPeakPhase = (startDate: Date, endDate: Date) => {
	const availableTrainingDays = daysBetween(startDate, endDate);
	return Math.ceil(availableTrainingDays * TrainingPlanPhasePercentages[TrainingPlanPhase.PEAK]);
};

/**
 * Calculates the number of days in the taper phase based on the start date and end date.
 *
 * @param {Date} startDate - the start date of the phase
 * @param {Date} endDate - the end date of the phase
 * @return {number} the number of days in the taper phase
 */
export const daysInTaperPhase = (startDate: Date, endDate: Date) => {
	const availableTrainingDays = daysBetween(startDate, endDate);
	return Math.ceil(availableTrainingDays * TrainingPlanPhasePercentages[TrainingPlanPhase.TAPER]);
};

export type DaysInPhases = {
	base: number;
	build: number;
	peak: number;
	taper: number;
};

/**
 * Generates an object containing the number of days in each phase based on the start and end dates.
 *
 * @param {Date} startDate - the start date of the phase
 * @param {Date} endDate - the end date of the phase
 * @return {DaysInPhases} an object with the number of days in each phase
 */
export const daysInPhases = (startDate: Date, endDate: Date): DaysInPhases => {
	return {
		base: daysInBasePhase(startDate, endDate),
		build: daysInBuildingPhase(startDate, endDate),
		peak: daysInPeakPhase(startDate, endDate),
		taper: daysInTaperPhase(startDate, endDate)
	};
};

/**
 * Generates FTP zones based on the FTP value.
 *
 * @param {number} ftp - the FTP value
 * @return {FtpZones} the FTP zones object
 */
export const ftpZones = (ftp: number): FtpZones => {
	return {
		zone1: { min: 0, max: ftp * zone1_max_ftp },
		zone2: { min: ftp * zone1_max_ftp, max: ftp * zone2_max_ftp },
		zone3: { min: ftp * zone2_max_ftp, max: ftp * zone3_max_ftp },
		zone4: { min: ftp * zone3_max_ftp, max: ftp * zone4_max_ftp },
		zone5: { min: ftp * zone4_max_ftp, max: ftp * zone5_max_ftp },
		zone6: { min: ftp * zone5_max_ftp, max: ftp * zone6_max_ftp },
		zone7: { min: ftp * zone6_max_ftp, max: Infinity }
	};
};

/**
 * Calculates the heart rate zones based on the maximum heart rate.
 *
 * @param {number} maxHR - The maximum heart rate.
 * @return {HRZones} An object containing the heart rate zones.
 */
export const hrZones = (maxHR: number): HRZones => {
	return {
		zone1: { min: 0, max: maxHR * zone1_max_hr },
		zone2: { min: maxHR * zone1_max_hr, max: maxHR * zone2_max_hr },
		zone3: { min: maxHR * zone2_max_hr, max: maxHR * zone3_max_hr },
		zone4: { min: maxHR * zone3_max_hr, max: maxHR * zone4_max_hr },
		zone5: { min: maxHR * zone4_max_hr, max: maxHR * zone5_max_hr }
	};
};
