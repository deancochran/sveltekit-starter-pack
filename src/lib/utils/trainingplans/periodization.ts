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
const zone1MaxFtp = 0.6;
const zone2MaxFtp = 0.75; //LT1
const zone3MaxFtp = 0.9;
const zone4MaxFtp = 1.05; //LT2
const zone5MaxFtp = 1.2;
const zone6MaxFtp = 1.35;

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
const zone6MaxHr = 0.6;
const zone2MaxHr = 0.7; //LT1
const zone3MaxHr = 0.8;
const zone4MaxHr = 0.9; //LT2
const zone5MaxHr = 1;

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
	return Math.ceil(
		availableTrainingDays * TrainingPlanPhasePercentages[TrainingPlanPhase.BASE]
	);
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
	return Math.ceil(
		availableTrainingDays *
			TrainingPlanPhasePercentages[TrainingPlanPhase.BUILD]
	);
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
	return Math.ceil(
		availableTrainingDays * TrainingPlanPhasePercentages[TrainingPlanPhase.PEAK]
	);
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
	return Math.ceil(
		availableTrainingDays *
			TrainingPlanPhasePercentages[TrainingPlanPhase.TAPER]
	);
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
		zone1: { min: 0, max: ftp * zone1MaxFtp },
		zone2: { min: ftp * zone1MaxFtp, max: ftp * zone2MaxFtp },
		zone3: { min: ftp * zone2MaxFtp, max: ftp * zone3MaxFtp },
		zone4: { min: ftp * zone3MaxFtp, max: ftp * zone4MaxFtp },
		zone5: { min: ftp * zone4MaxFtp, max: ftp * zone5MaxFtp },
		zone6: { min: ftp * zone5MaxFtp, max: ftp * zone6MaxFtp },
		zone7: { min: ftp * zone6MaxFtp, max: Infinity }
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
		zone1: { min: 0, max: maxHR * zone6MaxHr },
		zone2: { min: maxHR * zone6MaxHr, max: maxHR * zone2MaxHr },
		zone3: { min: maxHR * zone2MaxHr, max: maxHR * zone3MaxHr },
		zone4: { min: maxHR * zone3MaxHr, max: maxHR * zone4MaxHr },
		zone5: { min: maxHR * zone4MaxHr, max: maxHR * zone5MaxHr }
	};
};
