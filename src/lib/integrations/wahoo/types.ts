export type WahooWebhookEvent = {
	event_type: string;
	webhook_token: string;
	user: { id: number };
	workout_summary: {
		id: number;
		ascent_accum: number; // meters
		cadence_avg: number; //rpm
		calories_accum: number; //kcal
		distance_accum: number; //meters
		duration_active_accum: number; //seconds
		duration_paused_accum: number; //seconds
		duration_total_accum: number; //seconds
		heart_rate_avg: number; //bpm
		power_bike_np_last: number; //watts
		power_bike_tss_last: number; //unitless
		power_avg: number; //watts
		speed_avg: number; //meters per second
		work_accum: number; //joules
		created_at: Date; //string
		updated_at: Date; //string
	};
	file: {
		url: string;
	};
	workout: {
		id: number;
		starts: Date;
		minutes: number;
		name: string;
		created_at: Date;
		updated_at: Date;
		plan_id: number;
		workout_token: string;
		workout_type_id: WahooWorkoutTypeID;
	};
};

export type createWorkoutBody = {
	workout: {
		name: string;
		workout_token: number;
		workout_type_id: number;
		starts: Date;
		minutes: number;
	};
};
export type WahooTokenObj = {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	created_at: number;
};
export type WahooUser = {
	id: number;
	height: string;
	weight: string;
	first: string;
	last: string;
	email: string;
	birth: string;
	gender: number;
	created_at: string;
	updated_at: string;
};
export enum WahooWorkoutLocationType {
	INDOOR = 0,
	OUTDOOR = 1,
	UNKNOWN = 255
}
export enum WahooWorkoutFamilyType {
	BIKING = 0,
	RUNNING = 1,
	SWIMMING = 2,
	WATER_SPORTS = 3,
	SNOW_SPORTS = 4,
	SKATING = 5,
	GYM = 6,
	WALKING = 9,
	OTHER = 30,
	UNKNOWN = 255
}

export enum WahooWorkoutTypeID {
	BIKING = 0,
	RUNNING = 1,
	FE = 2,
	RUNNING_TRACK = 3,
	RUNNING_TRAIL = 4,
	RUNNING_TREADMILL = 5,
	WALKING = 6,
	WALKING_SPEED = 7,
	WALKING_NORDIC = 8,
	HIKING = 9,
	MOUNTAINEERING = 10,
	BIKING_CYCLECROSS = 11,
	BIKING_INDOOR = 12,
	BIKING_MOUNTAIN = 13,
	BIKING_RECUMBENT = 14,
	BIKING_ROAD = 15,
	BIKING_TRACK = 16,
	BIKING_MOTOCYCLING = 17,
	FE_GENERAL = 18,
	FE_TREADMILL = 19,
	FE_ELLIPTICAL = 20,
	FE_BIKE = 21,
	FE_ROWER = 22,
	FE_CLIMBER = 23,
	SWIMMING_LAP = 24,
	SWIMMING_OPEN_WATER = 25,
	SNOWBOARDING = 26,
	SKIING = 27,
	SKIING_DOWNHILL = 28,
	SKIINGCROSS_COUNTRY = 29,
	SKATING = 30,
	SKATING_OUTDOOR = 31,
	SKATING_ICE = 32,
	SKATING_INLINE = 33,
	LONG_BOARDING = 34,
	SAILING = 35,
	WINDSURFING = 36,
	CANOEING = 37,
	KAYAKING = 38,
	ROWING = 39,
	KITEBOARDING = 40,
	STAND_UP_PADDLE_BOARD = 41,
	WORKOUT = 42,
	CARDIO_CLASS = 43,
	STAIR_CLIMBER = 44,
	WHEELCHAIR = 45,
	GOLFING = 46,
	OTHER = 47,
	BIKING_INDOOR_CYCLING_CLASS = 49,
	WALKING_TREADMILL = 56,
	BIKING_INDOOR_TRAINER = 61,
	MULTISPORT = 62,
	TRANSITION = 63,
	EBIKING = 64,
	TICKR_OFFLINE = 65,
	YOGA = 66,
	RUNNING_RACE = 67,
	BIKING_INDOOR_VIRTUAL = 68,
	MENTAL_STRENGTH = 69,
	HANDCYCLING = 70,
	RUNNING_INDOOR_VIRTUAL = 71,
	UNKNOWN = 255
}

export const WahooRunningWorkoutTypeIds = [
	WahooWorkoutTypeID.RUNNING,
	WahooWorkoutTypeID.RUNNING_INDOOR_VIRTUAL,
	WahooWorkoutTypeID.RUNNING_RACE,
	WahooWorkoutTypeID.RUNNING_TRACK,
	WahooWorkoutTypeID.RUNNING_TRAIL,
	WahooWorkoutTypeID.RUNNING_TREADMILL
];

export const WahooBikingWorkoutTypeIds = [
	WahooWorkoutTypeID.BIKING,
	WahooWorkoutTypeID.BIKING_INDOOR,
	WahooWorkoutTypeID.BIKING_MOUNTAIN,
	WahooWorkoutTypeID.BIKING_RECUMBENT,
	WahooWorkoutTypeID.BIKING_ROAD,
	WahooWorkoutTypeID.BIKING_TRACK,
	WahooWorkoutTypeID.BIKING_MOTOCYCLING,
	WahooWorkoutTypeID.BIKING_INDOOR_TRAINER,
	WahooWorkoutTypeID.BIKING_INDOOR_CYCLING_CLASS,
	WahooWorkoutTypeID.BIKING_INDOOR_VIRTUAL,
	WahooWorkoutTypeID.HANDCYCLING
];

export const WahooSWimmingWorkoutTypeIds = [
	WahooWorkoutTypeID.SWIMMING_LAP,
	WahooWorkoutTypeID.SWIMMING_OPEN_WATER
];

export enum WAHOO_PLAN_FAMILY_TYPE {
	BIKING = 0,
	RUNNING = 1
}
export enum WAHOO_PLAN_WORKOUT_TYPE_LOCATION {
	INDOOR = 0,
	OUTDOOR = 1
}

export enum WAHOO_PLAN_TARGET_TYPE {
	RPM = 'rpm', //cadence based target in rotations per minute absolute rpm
	RPE = 'rpe', //relative percieved effort, 1-10 inclusive absolute rpe
	WATTS = 'watts', //watts based target in watts absolute watts
	HR = 'hr', //heart rate based target in beats per minute absolute hr
	SPEED = 'speed', //speed based target in meters per second absolute speed
	FTP = 'ftp', //ftp based target in watts absolute ftp **only valid if athlete’s FTP value is supplied in the header relative watts
	MAP = 'map', //map based target in meters absolute map **only valid if athlete’s MAP value is supplied in the header relative watts
	AC = 'ac', //4DP power target based on the user’s 1min power, value of 1 indicates 100% of the user’s AC 4DP value **only valid if athlete’s AC value is supplied in the header relative watts
	nm = 'nm', //4DP power target based on the user’s 5sec power, value of 1 indicates 100% of the user’s NM 4DP value **only valid if athlete’s nm value is supplied in the header relative watts
	THRESHOLD_HR = 'threshold_hr', //threshold_hr portion of HR target based on the user’s threshold HR, value of 1 indicates 100% of the user’s Threshold HR
	MAX_HR = 'max_hr', //max_hr portion of HR target based on the user’s max HR, value of 1 indicates 100% of the user’s max HR
	THRESHOLD_SPEED = 'threshold_speed' //threshold_speed portion of speed target based on the user’s threshold speed, value of 1 indicates 100% of the user’s threshold speed
}
export enum WAHOO_PLAN_CONTROL_TYPE {
	/**
	 *	adjusts the grade of the treadmill. Value should be a decimal. (e.g. 0.02 will raise the treadmill to 2%).
	 *	grade changes will persist across intervals, to go back to a grade of 0% you must explicitly set the grade
	 *	to 0 for the next interval.
	 */
	GRADE = 'grade'
}

export enum WAHOO_PLAN_TRIGGER_TYPE {
	TIME = 'time', //time measured in seconds
	DISTANCE = 'distance', //distance measured in meters
	KJ2 = 'kj2', //kj2 measured in kilojoules (work performed)
	REPEAT = 'repeat' //repeat used by a parent interval to determine how many times AFTER the first iteration to repeat the interval (and any subintervals)
}

export enum WAHOO_PLAN_INTENSITY_TYPE {
	ACTIVE = 'active', // (default) active
	WU = 'wu', // warm up
	TEMPO = 'tempo', // tempo
	LT = 'lt', // lactate threshold
	MAP = 'map', // maximal aerobic power
	AC = 'ac', // anaerobic capacity
	NM = 'nm', // neuromuscular power
	FTP = 'ftp', // functional threshold power
	CD = 'cd', // cool down
	RECOVER = 'recover', // recovery
	REST = 'rest' // rest
}

export type WAHOO_PLAN_HEADER = {
	name: string;
	version: '1.0.0';
	description?: string;
	duration_s?: number;
	distance_m?: number;
	workout_type_family: WAHOO_PLAN_FAMILY_TYPE;
	workout_type_location?: WAHOO_PLAN_WORKOUT_TYPE_LOCATION; // this possibly is required?
	ftp?: number;
	map?: number;
	ac?: number;
	nm?: number;
	threshold_hr?: number;
	max_hr?: number;
	threshold_speed?: number;
};

export type WAHOO_PLAN_TARGETS = {
	type: WAHOO_PLAN_TARGET_TYPE;
	low: number;
	high: number;
};

export type WAHOO_PLAN_CONTROLS = {
	type: WAHOO_PLAN_CONTROL_TYPE;
	value: number;
};

export type WAHOO_PLAN_INTERVALS = {
	name?: string;
	exit_trigger_type: WAHOO_PLAN_TRIGGER_TYPE;
	exit_trigger_value: number;
	intensity_type?: WAHOO_PLAN_INTENSITY_TYPE;
	targets: Array<WAHOO_PLAN_TARGETS>;
	controls?: Array<WAHOO_PLAN_CONTROLS>;
};

export type WAHOO_PLAN_REPEAT_INTERVAL = {
	name?: string;
	exit_trigger_type: WAHOO_PLAN_TRIGGER_TYPE.REPEAT;
	exit_trigger_value: number;
	intervals?: Array<WAHOO_PLAN_INTERVALS>;
};

export type WahooV1Plan = {
	header: WAHOO_PLAN_HEADER;
	intervals: Array<WAHOO_PLAN_INTERVALS | WAHOO_PLAN_REPEAT_INTERVAL>;
};

export type WahooV1PlanRequestBody = {
	plan: {
		file: string;
		filename: string;
		external_id?: string;
		provider_updated_at: string;
	};
};
export type WahooV1PlanResponse = {
	id: number;
	user_id: number;
	name: string;
	description: string;
	file: {
		url: string;
	};
	workout_type_family_id: number;
	workout_type_location_id: number;
	external_id: string;
	provider_updated_at: Date; //Date ISO String
	deleted: boolean;
	updated_at: Date; //Date ISO String
	created_at: Date; //Date ISO String
};

export type WahooCreateWorkoutRequestBody = {
	workout: {
		name: string;
		workout_type_id: WahooWorkoutTypeID;
		starts: Date; // convert to ISO STRING
		minutes: number;
		workout_token: string;
		plan_id?: number;
		workout_summary_id?: object;
	};
};

export type WahooCreateWorkoutResponse = {
	id: number;
	starts: Date; // DATE ISO STRING
	minutes: number;
	name: string;
	created_at: Date; // DATE ISO STRING
	updated_at: Date; // DATE ISO STRING
	plan_id: number;
	workout_token: string;
	workout_type_id: number;
};
