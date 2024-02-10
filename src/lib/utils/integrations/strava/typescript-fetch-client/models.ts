/**
 * A set of rolled-up statistics and totals for an athlete
 * @export
 * @interface ActivityStats
 */
export interface ActivityStats {
    /**
     * The longest distance ridden by the athlete.
     * @type {number}
     * @memberof ActivityStats
     */
    biggestRideDistance?: number;
    /**
     * The highest climb ridden by the athlete.
     * @type {number}
     * @memberof ActivityStats
     */
    biggestClimbElevationGain?: number;
    /**
     * The recent (last 4 weeks) ride stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    recentRideTotals?: ActivityTotal;
    /**
     * The recent (last 4 weeks) run stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    recentRunTotals?: ActivityTotal;
    /**
     * The recent (last 4 weeks) swim stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    recentSwimTotals?: ActivityTotal;
    /**
     * The year to date ride stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    ytdRideTotals?: ActivityTotal;
    /**
     * The year to date run stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    ytdRunTotals?: ActivityTotal;
    /**
     * The year to date swim stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    ytdSwimTotals?: ActivityTotal;
    /**
     * The all time ride stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    allRideTotals?: ActivityTotal;
    /**
     * The all time run stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    allRunTotals?: ActivityTotal;
    /**
     * The all time swim stats for the athlete.
     * @type {ActivityTotal}
     * @memberof ActivityStats
     */
    allSwimTotals?: ActivityTotal;
}

/**
 * A roll-up of metrics pertaining to a set of activities. Values are in seconds and meters.
 * @export
 * @interface ActivityTotal
 */
export interface ActivityTotal {
    /**
     * The number of activities considered in this total.
     * @type {number}
     * @memberof ActivityTotal
     */
    count?: number;
    /**
     * The total distance covered by the considered activities.
     * @type {number}
     * @memberof ActivityTotal
     */
    distance?: number;
    /**
     * The total moving time of the considered activities.
     * @type {number}
     * @memberof ActivityTotal
     */
    movingTime?: number;
    /**
     * The total elapsed time of the considered activities.
     * @type {number}
     * @memberof ActivityTotal
     */
    elapsedTime?: number;
    /**
     * The total elevation gain of the considered activities.
     * @type {number}
     * @memberof ActivityTotal
     */
    elevationGain?: number;
    /**
     * The total number of achievements of the considered activities.
     * @type {number}
     * @memberof ActivityTotal
     */
    achievementCount?: number;
}

/**
 * An enumeration of the types an activity may have. Note that this enumeration does not include new sport types (e.g. MountainBikeRide, EMountainBikeRide), activities with these sport types will have the corresponding activity type (e.g. Ride for MountainBikeRide, EBikeRide for EMountainBikeRide)
 * @export
 * @enum {string}
 */
export enum ActivityType {
    AlpineSki = 'AlpineSki',
    BackcountrySki = 'BackcountrySki',
    Canoeing = 'Canoeing',
    Crossfit = 'Crossfit',
    EBikeRide = 'EBikeRide',
    Elliptical = 'Elliptical',
    Golf = 'Golf',
    Handcycle = 'Handcycle',
    Hike = 'Hike',
    IceSkate = 'IceSkate',
    InlineSkate = 'InlineSkate',
    Kayaking = 'Kayaking',
    Kitesurf = 'Kitesurf',
    NordicSki = 'NordicSki',
    Ride = 'Ride',
    RockClimbing = 'RockClimbing',
    RollerSki = 'RollerSki',
    Rowing = 'Rowing',
    Run = 'Run',
    Sail = 'Sail',
    Skateboard = 'Skateboard',
    Snowboard = 'Snowboard',
    Snowshoe = 'Snowshoe',
    Soccer = 'Soccer',
    StairStepper = 'StairStepper',
    StandUpPaddling = 'StandUpPaddling',
    Surfing = 'Surfing',
    Swim = 'Swim',
    Velomobile = 'Velomobile',
    VirtualRide = 'VirtualRide',
    VirtualRun = 'VirtualRun',
    Walk = 'Walk',
    WeightTraining = 'WeightTraining',
    Wheelchair = 'Wheelchair',
    Windsurf = 'Windsurf',
    Workout = 'Workout',
    Yoga = 'Yoga'
}

/**
 * 
 * @export
 * @interface ActivityZone
 */
export interface ActivityZone {
    /**
     * 
     * @type {number}
     * @memberof ActivityZone
     */
    score?: number;
    /**
     * 
     * @type {TimedZoneDistribution}
     * @memberof ActivityZone
     */
    distributionBuckets?: TimedZoneDistribution;
    /**
     * 
     * @type {string}
     * @memberof ActivityZone
     */
    type?: ActivityZone.TypeEnum;
    /**
     * 
     * @type {boolean}
     * @memberof ActivityZone
     */
    sensorBased?: boolean;
    /**
     * 
     * @type {number}
     * @memberof ActivityZone
     */
    points?: number;
    /**
     * 
     * @type {boolean}
     * @memberof ActivityZone
     */
    customZones?: boolean;
    /**
     * 
     * @type {number}
     * @memberof ActivityZone
     */
    max?: number;
}


/**
 * @export
 * @namespace ActivityZone
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ActivityZone {
    /**
     * @export
     * @enum {string}
     */
    export enum TypeEnum {
        Heartrate = 'heartrate',
        Power = 'power'
    }
}

/**
 * 
 * @export
 * @interface AltitudeStream
 */
export interface AltitudeStream extends BaseStream {
    /**
     * The sequence of altitude values for this stream, in meters
     * @type {Array<number>}
     * @memberof AltitudeStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace AltitudeStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AltitudeStream {
    
}

/**
 * 
 * @export
 * @interface BaseStream
 */
export interface BaseStream {
    /**
     * The number of data points in this stream
     * @type {number}
     * @memberof BaseStream
     */
    originalSize?: number;
    /**
     * The level of detail (sampling) in which this stream was returned
     * @type {string}
     * @memberof BaseStream
     */
    resolution?: BaseStream.ResolutionEnum;
    /**
     * The base series used in the case the stream was downsampled
     * @type {string}
     * @memberof BaseStream
     */
    seriesType?: BaseStream.SeriesTypeEnum;
}

/**
 * @export
 * @namespace BaseStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BaseStream {
    /**
     * @export
     * @enum {string}
     */
    export enum ResolutionEnum {
        Low = 'low',
        Medium = 'medium',
        High = 'high'
    }
    /**
     * @export
     * @enum {string}
     */
    export enum SeriesTypeEnum {
        Distance = 'distance',
        Time = 'time'
    }
}

/**
 * 
 * @export
 * @interface CadenceStream
 */
export interface CadenceStream extends BaseStream {
    /**
     * The sequence of cadence values for this stream, in rotations per minute
     * @type {Array<number>}
     * @memberof CadenceStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace CadenceStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CadenceStream {
}

/**
 * 
 * @export
 * @interface ClubActivity
 */
export interface ClubActivity {
    /**
     * 
     * @type {MetaAthlete}
     * @memberof ClubActivity
     */
    athlete?: MetaAthlete;
    /**
     * The name of the activity
     * @type {string}
     * @memberof ClubActivity
     */
    name?: string;
    /**
     * The activity's distance, in meters
     * @type {number}
     * @memberof ClubActivity
     */
    distance?: number;
    /**
     * The activity's moving time, in seconds
     * @type {number}
     * @memberof ClubActivity
     */
    movingTime?: number;
    /**
     * The activity's elapsed time, in seconds
     * @type {number}
     * @memberof ClubActivity
     */
    elapsedTime?: number;
    /**
     * The activity's total elevation gain.
     * @type {number}
     * @memberof ClubActivity
     */
    totalElevationGain?: number;
    /**
     * Deprecated. Prefer to use sport_type
     * @type {ActivityType}
     * @memberof ClubActivity
     */
    type?: ActivityType;
    /**
     * 
     * @type {SportType}
     * @memberof ClubActivity
     */
    sportType?: SportType;
    /**
     * The activity's workout type
     * @type {number}
     * @memberof ClubActivity
     */
    workoutType?: number;
}

/**
 * 
 * @export
 * @interface ClubAthlete
 */
export interface ClubAthlete {
    /**
     * Resource state, indicates level of detail. Possible values: 1 -> \"meta\", 2 -> \"summary\", 3 -> \"detail\"
     * @type {number}
     * @memberof ClubAthlete
     */
    resourceState?: number;
    /**
     * The athlete's first name.
     * @type {string}
     * @memberof ClubAthlete
     */
    firstname?: string;
    /**
     * The athlete's last initial.
     * @type {string}
     * @memberof ClubAthlete
     */
    lastname?: string;
    /**
     * The athlete's member status.
     * @type {string}
     * @memberof ClubAthlete
     */
    member?: string;
    /**
     * Whether the athlete is a club admin.
     * @type {boolean}
     * @memberof ClubAthlete
     */
    admin?: boolean;
    /**
     * Whether the athlete is club owner.
     * @type {boolean}
     * @memberof ClubAthlete
     */
    owner?: boolean;
}

/**
 * 
 * @export
 * @interface Comment
 */
export interface Comment {
    /**
     * The unique identifier of this comment
     * @type {number}
     * @memberof Comment
     */
    id?: number;
    /**
     * The identifier of the activity this comment is related to
     * @type {number}
     * @memberof Comment
     */
    activityId?: number;
    /**
     * The content of the comment
     * @type {string}
     * @memberof Comment
     */
    text?: string;
    /**
     * 
     * @type {SummaryAthlete}
     * @memberof Comment
     */
    athlete?: SummaryAthlete;
    /**
     * The time at which this comment was created.
     * @type {Date}
     * @memberof Comment
     */
    createdAt?: Date;
}

/**
 * 
 * @export
 * @interface DetailedActivity
 */
export interface DetailedActivity extends SummaryActivity {
    /**
     * The description of the activity
     * @type {string}
     * @memberof DetailedActivity
     */
    description?: string;
    /**
     * 
     * @type {PhotosSummary}
     * @memberof DetailedActivity
     */
    photos?: PhotosSummary;
    /**
     * 
     * @type {SummaryGear}
     * @memberof DetailedActivity
     */
    gear?: SummaryGear;
    /**
     * The number of kilocalories consumed during this activity
     * @type {number}
     * @memberof DetailedActivity
     */
    calories?: number;
    /**
     * 
     * @type {Array<DetailedSegmentEffort>}
     * @memberof DetailedActivity
     */
    segmentEfforts?: Array<DetailedSegmentEffort>;
    /**
     * The name of the device used to record the activity
     * @type {string}
     * @memberof DetailedActivity
     */
    deviceName?: string;
    /**
     * The token used to embed a Strava activity
     * @type {string}
     * @memberof DetailedActivity
     */
    embedToken?: string;
    /**
     * The splits of this activity in metric units (for runs)
     * @type {Array<Split>}
     * @memberof DetailedActivity
     */
    splitsMetric?: Array<Split>;
    /**
     * The splits of this activity in imperial units (for runs)
     * @type {Array<Split>}
     * @memberof DetailedActivity
     */
    splitsStandard?: Array<Split>;
    /**
     * 
     * @type {Array<Lap>}
     * @memberof DetailedActivity
     */
    laps?: Array<Lap>;
    /**
     * 
     * @type {Array<DetailedSegmentEffort>}
     * @memberof DetailedActivity
     */
    bestEfforts?: Array<DetailedSegmentEffort>;
}

/**
 * 
 * @export
 * @interface DetailedAthlete
 */
export interface DetailedAthlete extends SummaryAthlete {
    /**
     * The athlete's follower count.
     * @type {number}
     * @memberof DetailedAthlete
     */
    followerCount?: number;
    /**
     * The athlete's friend count.
     * @type {number}
     * @memberof DetailedAthlete
     */
    friendCount?: number;
    /**
     * The athlete's preferred unit system.
     * @type {string}
     * @memberof DetailedAthlete
     */
    measurementPreference?: DetailedAthlete.MeasurementPreferenceEnum;
    /**
     * The athlete's FTP (Functional Threshold Power).
     * @type {number}
     * @memberof DetailedAthlete
     */
    ftp?: number;
    /**
     * The athlete's weight.
     * @type {number}
     * @memberof DetailedAthlete
     */
    weight?: number;
    /**
     * The athlete's clubs.
     * @type {Array<SummaryClub>}
     * @memberof DetailedAthlete
     */
    clubs?: Array<SummaryClub>;
    /**
     * The athlete's bikes.
     * @type {Array<SummaryGear>}
     * @memberof DetailedAthlete
     */
    bikes?: Array<SummaryGear>;
    /**
     * The athlete's shoes.
     * @type {Array<SummaryGear>}
     * @memberof DetailedAthlete
     */
    shoes?: Array<SummaryGear>;
}

/**
 * @export
 * @namespace DetailedAthlete
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DetailedAthlete {
    /**
     * @export
     * @enum {string}
     */
    export enum MeasurementPreferenceEnum {
        Feet = 'feet',
        Meters = 'meters'
    }
}

/**
 * 
 * @export
 * @interface DetailedClub
 */
export interface DetailedClub extends SummaryClub {
    /**
     * The membership status of the logged-in athlete.
     * @type {string}
     * @memberof DetailedClub
     */
    membership?: DetailedClub.MembershipEnum;
    /**
     * Whether the currently logged-in athlete is an administrator of this club.
     * @type {boolean}
     * @memberof DetailedClub
     */
    admin?: boolean;
    /**
     * Whether the currently logged-in athlete is the owner of this club.
     * @type {boolean}
     * @memberof DetailedClub
     */
    owner?: boolean;
    /**
     * The number of athletes in the club that the logged-in athlete follows.
     * @type {number}
     * @memberof DetailedClub
     */
    followingCount?: number;
}

/**
 * @export
 * @namespace DetailedClub
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DetailedClub {
    /**
     * @export
     * @enum {string}
     */
    export enum MembershipEnum {
        Member = 'member',
        Pending = 'pending'
    }
}

/**
 * 
 * @export
 * @interface DetailedGear
 */
export interface DetailedGear extends SummaryGear {
    /**
     * The gear's brand name.
     * @type {string}
     * @memberof DetailedGear
     */
    brandName?: string;
    /**
     * The gear's model name.
     * @type {string}
     * @memberof DetailedGear
     */
    modelName?: string;
    /**
     * The gear's frame type (bike only).
     * @type {number}
     * @memberof DetailedGear
     */
    frameType?: number;
    /**
     * The gear's description.
     * @type {string}
     * @memberof DetailedGear
     */
    description?: string;
}

/**
 * 
 * @export
 * @interface DetailedSegment
 */
export interface DetailedSegment extends SummarySegment {
    /**
     * The time at which the segment was created.
     * @type {Date}
     * @memberof DetailedSegment
     */
    createdAt?: Date;
    /**
     * The time at which the segment was last updated.
     * @type {Date}
     * @memberof DetailedSegment
     */
    updatedAt?: Date;
    /**
     * The segment's total elevation gain.
     * @type {number}
     * @memberof DetailedSegment
     */
    totalElevationGain?: number;
    /**
     * 
     * @type {PolylineMap}
     * @memberof DetailedSegment
     */
    map?: PolylineMap;
    /**
     * The total number of efforts for this segment
     * @type {number}
     * @memberof DetailedSegment
     */
    effortCount?: number;
    /**
     * The number of unique athletes who have an effort for this segment
     * @type {number}
     * @memberof DetailedSegment
     */
    athleteCount?: number;
    /**
     * Whether this segment is considered hazardous
     * @type {boolean}
     * @memberof DetailedSegment
     */
    hazardous?: boolean;
    /**
     * The number of stars for this segment
     * @type {number}
     * @memberof DetailedSegment
     */
    starCount?: number;
}

/**
 * @export
 * @namespace DetailedSegment
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DetailedSegment {
}

/**
 * 
 * @export
 * @interface DetailedSegmentEffort
 */
export interface DetailedSegmentEffort extends SummarySegmentEffort {
    /**
     * The name of the segment on which this effort was performed
     * @type {string}
     * @memberof DetailedSegmentEffort
     */
    name?: string;
    /**
     * 
     * @type {MetaActivity}
     * @memberof DetailedSegmentEffort
     */
    activity?: MetaActivity;
    /**
     * 
     * @type {MetaAthlete}
     * @memberof DetailedSegmentEffort
     */
    athlete?: MetaAthlete;
    /**
     * The effort's moving time
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    movingTime?: number;
    /**
     * The start index of this effort in its activity's stream
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    startIndex?: number;
    /**
     * The end index of this effort in its activity's stream
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    endIndex?: number;
    /**
     * The effort's average cadence
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    averageCadence?: number;
    /**
     * The average wattage of this effort
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    averageWatts?: number;
    /**
     * For riding efforts, whether the wattage was reported by a dedicated recording device
     * @type {boolean}
     * @memberof DetailedSegmentEffort
     */
    deviceWatts?: boolean;
    /**
     * The heart heart rate of the athlete during this effort
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    averageHeartrate?: number;
    /**
     * The maximum heart rate of the athlete during this effort
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    maxHeartrate?: number;
    /**
     * 
     * @type {SummarySegment}
     * @memberof DetailedSegmentEffort
     */
    segment?: SummarySegment;
    /**
     * The rank of the effort on the global leaderboard if it belongs in the top 10 at the time of upload
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    komRank?: number;
    /**
     * The rank of the effort on the athlete's leaderboard if it belongs in the top 3 at the time of upload
     * @type {number}
     * @memberof DetailedSegmentEffort
     */
    prRank?: number;
    /**
     * Whether this effort should be hidden when viewed within an activity
     * @type {boolean}
     * @memberof DetailedSegmentEffort
     */
    hidden?: boolean;
}

/**
 * 
 * @export
 * @interface DistanceStream
 */
export interface DistanceStream extends BaseStream {
    /**
     * The sequence of distance values for this stream, in meters
     * @type {Array<number>}
     * @memberof DistanceStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace DistanceStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DistanceStream {
}

/**
 * 
 * @export
 * @interface ExplorerResponse
 */
export interface ExplorerResponse {
    /**
     * The set of segments matching an explorer request
     * @type {Array<ExplorerSegment>}
     * @memberof ExplorerResponse
     */
    segments?: Array<ExplorerSegment>;
}

/**
 * 
 * @export
 * @interface ExplorerSegment
 */
export interface ExplorerSegment {
    /**
     * The unique identifier of this segment
     * @type {number}
     * @memberof ExplorerSegment
     */
    id?: number;
    /**
     * The name of this segment
     * @type {string}
     * @memberof ExplorerSegment
     */
    name?: string;
    /**
     * The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category. If climb_category = 5, climb_category_desc = HC. If climb_category = 2, climb_category_desc = 3.
     * @type {number}
     * @memberof ExplorerSegment
     */
    climbCategory?: number;
    /**
     * The description for the category of the climb
     * @type {string}
     * @memberof ExplorerSegment
     */
    climbCategoryDesc?: ExplorerSegment.ClimbCategoryDescEnum;
    /**
     * The segment's average grade, in percents
     * @type {number}
     * @memberof ExplorerSegment
     */
    avgGrade?: number;
    /**
     * 
     * @type {LatLng}
     * @memberof ExplorerSegment
     */
    startLatlng?: LatLng;
    /**
     * 
     * @type {LatLng}
     * @memberof ExplorerSegment
     */
    endLatlng?: LatLng;
    /**
     * The segments's evelation difference, in meters
     * @type {number}
     * @memberof ExplorerSegment
     */
    elevDifference?: number;
    /**
     * The segment's distance, in meters
     * @type {number}
     * @memberof ExplorerSegment
     */
    distance?: number;
    /**
     * The polyline of the segment
     * @type {string}
     * @memberof ExplorerSegment
     */
    points?: string;
}

/**
 * @export
 * @namespace ExplorerSegment
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ExplorerSegment {
    /**
     * @export
     * @enum {string}
     */
    export enum ClimbCategoryDescEnum {
        NC = 'NC',
        _4 = '4',
        _3 = '3',
        _2 = '2',
        _1 = '1',
        HC = 'HC'
    }
}

/**
 * Encapsulates the errors that may be returned from the API.
 * @export
 * @interface Fault
 */
export interface Fault {
    /**
     * The set of specific errors associated with this fault, if unknown.
     * @type {Array<Error>}
     * @memberof Fault
     */
    errors?: Array<Error>;
    /**
     * The message of the fault.
     * @type {string}
     * @memberof Fault
     */
    message?: string;
}

/**
 * 
 * @export
 * @interface HeartRateZoneRanges
 */
export interface HeartRateZoneRanges {
    /**
     * Whether the athlete has set their own custom heart rate zones
     * @type {boolean}
     * @memberof HeartRateZoneRanges
     */
    customZones?: boolean;
    /**
     * 
     * @type {ZoneRanges}
     * @memberof HeartRateZoneRanges
     */
    zones?: ZoneRanges;
}

/**
 * 
 * @export
 * @interface HeartrateStream
 */
export interface HeartrateStream extends BaseStream {
    /**
     * The sequence of heart rate values for this stream, in beats per minute
     * @type {Array<number>}
     * @memberof HeartrateStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace HeartrateStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace HeartrateStream {
}

/**
 * 
 * @export
 * @interface Lap
 */
export interface Lap {
    /**
     * The unique identifier of this lap
     * @type {number}
     * @memberof Lap
     */
    id?: number;
    /**
     * 
     * @type {MetaActivity}
     * @memberof Lap
     */
    activity?: MetaActivity;
    /**
     * 
     * @type {MetaAthlete}
     * @memberof Lap
     */
    athlete?: MetaAthlete;
    /**
     * The lap's average cadence
     * @type {number}
     * @memberof Lap
     */
    averageCadence?: number;
    /**
     * The lap's average speed
     * @type {number}
     * @memberof Lap
     */
    averageSpeed?: number;
    /**
     * The lap's distance, in meters
     * @type {number}
     * @memberof Lap
     */
    distance?: number;
    /**
     * The lap's elapsed time, in seconds
     * @type {number}
     * @memberof Lap
     */
    elapsedTime?: number;
    /**
     * The start index of this effort in its activity's stream
     * @type {number}
     * @memberof Lap
     */
    startIndex?: number;
    /**
     * The end index of this effort in its activity's stream
     * @type {number}
     * @memberof Lap
     */
    endIndex?: number;
    /**
     * The index of this lap in the activity it belongs to
     * @type {number}
     * @memberof Lap
     */
    lapIndex?: number;
    /**
     * The maximum speed of this lat, in meters per second
     * @type {number}
     * @memberof Lap
     */
    maxSpeed?: number;
    /**
     * The lap's moving time, in seconds
     * @type {number}
     * @memberof Lap
     */
    movingTime?: number;
    /**
     * The name of the lap
     * @type {string}
     * @memberof Lap
     */
    name?: string;
    /**
     * The athlete's pace zone during this lap
     * @type {number}
     * @memberof Lap
     */
    paceZone?: number;
    /**
     * 
     * @type {number}
     * @memberof Lap
     */
    split?: number;
    /**
     * The time at which the lap was started.
     * @type {Date}
     * @memberof Lap
     */
    startDate?: Date;
    /**
     * The time at which the lap was started in the local timezone.
     * @type {Date}
     * @memberof Lap
     */
    startDateLocal?: Date;
    /**
     * The elevation gain of this lap, in meters
     * @type {number}
     * @memberof Lap
     */
    totalElevationGain?: number;
}

/**
 * A pair of latitude/longitude coordinates, represented as an array of 2 floating point numbers.
 * @export
 * @interface LatLng
 */
export interface LatLng extends Array<number> {
}

/**
 * 
 * @export
 * @interface LatLngStream
 */
export interface LatLngStream extends BaseStream {
    /**
     * The sequence of lat/long values for this stream
     * @type {Array<LatLng>}
     * @memberof LatLngStream
     */
    data?: Array<LatLng>;
}

/**
 * @export
 * @namespace LatLngStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LatLngStream {
}

/**
 * 
 * @export
 * @interface MetaActivity
 */
export interface MetaActivity {
    /**
     * The unique identifier of the activity
     * @type {number}
     * @memberof MetaActivity
     */
    id?: number;
}

/**
 * 
 * @export
 * @interface MetaAthlete
 */
export interface MetaAthlete {
    /**
     * The unique identifier of the athlete
     * @type {number}
     * @memberof MetaAthlete
     */
    id?: number;
}

/**
 * 
 * @export
 * @interface MetaClub
 */
export interface MetaClub {
    /**
     * The club's unique identifier.
     * @type {number}
     * @memberof MetaClub
     */
    id?: number;
    /**
     * Resource state, indicates level of detail. Possible values: 1 -> \"meta\", 2 -> \"summary\", 3 -> \"detail\"
     * @type {number}
     * @memberof MetaClub
     */
    resourceState?: number;
    /**
     * The club's name.
     * @type {string}
     * @memberof MetaClub
     */
    name?: string;
}

/**
 * 
 * @export
 * @interface ModelError
 */
export interface ModelError {
    /**
     * The code associated with this error.
     * @type {string}
     * @memberof ModelError
     */
    code?: string;
    /**
     * The specific field or aspect of the resource associated with this error.
     * @type {string}
     * @memberof ModelError
     */
    field?: string;
    /**
     * The type of resource associated with this error.
     * @type {string}
     * @memberof ModelError
     */
    resource?: string;
}

/**
 * 
 * @export
 * @interface MovingStream
 */
export interface MovingStream extends BaseStream {
    /**
     * The sequence of moving values for this stream, as boolean values
     * @type {Array<boolean>}
     * @memberof MovingStream
     */
    data?: Array<boolean>;
}

/**
 * @export
 * @namespace MovingStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MovingStream {
}

/**
 * 
 * @export
 * @interface PhotosSummary
 */
export interface PhotosSummary {
    /**
     * The number of photos
     * @type {number}
     * @memberof PhotosSummary
     */
    count?: number;
    /**
     * 
     * @type {PhotosSummaryPrimary}
     * @memberof PhotosSummary
     */
    primary?: PhotosSummaryPrimary;
}

/**
 * 
 * @export
 * @interface PhotosSummaryPrimary
 */
export interface PhotosSummaryPrimary {
    /**
     * 
     * @type {number}
     * @memberof PhotosSummaryPrimary
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof PhotosSummaryPrimary
     */
    source?: number;
    /**
     * 
     * @type {string}
     * @memberof PhotosSummaryPrimary
     */
    uniqueId?: string;
    /**
     * 
     * @type {{ [key: string]: string; }}
     * @memberof PhotosSummaryPrimary
     */
    urls?: { [key: string]: string; };
}

/**
 * 
 * @export
 * @interface PolylineMap
 */
export interface PolylineMap {
    /**
     * The identifier of the map
     * @type {string}
     * @memberof PolylineMap
     */
    id?: string;
    /**
     * The polyline of the map, only returned on detailed representation of an object
     * @type {string}
     * @memberof PolylineMap
     */
    polyline?: string;
    /**
     * The summary polyline of the map
     * @type {string}
     * @memberof PolylineMap
     */
    summary_polyline?: string;
}

/**
 * 
 * @export
 * @interface PowerStream
 */
export interface PowerStream extends BaseStream {
    /**
     * The sequence of power values for this stream, in watts
     * @type {Array<number>}
     * @memberof PowerStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace PowerStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PowerStream {
}

/**
 * 
 * @export
 * @interface PowerZoneRanges
 */
export interface PowerZoneRanges {
    /**
     * 
     * @type {ZoneRanges}
     * @memberof PowerZoneRanges
     */
    zones?: ZoneRanges;
}

/**
 * 
 * @export
 * @interface Route
 */
export interface Route {
    /**
     * 
     * @type {SummaryAthlete}
     * @memberof Route
     */
    athlete?: SummaryAthlete;
    /**
     * The description of the route
     * @type {string}
     * @memberof Route
     */
    description?: string;
    /**
     * The route's distance, in meters
     * @type {number}
     * @memberof Route
     */
    distance?: number;
    /**
     * The route's elevation gain.
     * @type {number}
     * @memberof Route
     */
    elevationGain?: number;
    /**
     * The unique identifier of this route
     * @type {number}
     * @memberof Route
     */
    id?: number;
    /**
     * The unique identifier of the route in string format
     * @type {string}
     * @memberof Route
     */
    idStr?: string;
    /**
     * 
     * @type {PolylineMap}
     * @memberof Route
     */
    map?: PolylineMap;
    /**
     * The name of this route
     * @type {string}
     * @memberof Route
     */
    name?: string;
    /**
     * Whether this route is private
     * @type {boolean}
     * @memberof Route
     */
    _private?: boolean;
    /**
     * Whether this route is starred by the logged-in athlete
     * @type {boolean}
     * @memberof Route
     */
    starred?: boolean;
    /**
     * An epoch timestamp of when the route was created
     * @type {number}
     * @memberof Route
     */
    timestamp?: number;
    /**
     * This route's type (1 for ride, 2 for runs)
     * @type {number}
     * @memberof Route
     */
    type?: number;
    /**
     * This route's sub-type (1 for road, 2 for mountain bike, 3 for cross, 4 for trail, 5 for mixed)
     * @type {number}
     * @memberof Route
     */
    subType?: number;
    /**
     * The time at which the route was created
     * @type {Date}
     * @memberof Route
     */
    createdAt?: Date;
    /**
     * The time at which the route was last updated
     * @type {Date}
     * @memberof Route
     */
    updatedAt?: Date;
    /**
     * Estimated time in seconds for the authenticated athlete to complete route
     * @type {number}
     * @memberof Route
     */
    estimatedMovingTime?: number;
    /**
     * The segments traversed by this route
     * @type {Array<SummarySegment>}
     * @memberof Route
     */
    segments?: Array<SummarySegment>;
}

/**
 * 
 * @export
 * @interface SmoothGradeStream
 */
export interface SmoothGradeStream extends BaseStream {
    /**
     * The sequence of grade values for this stream, as percents of a grade
     * @type {Array<number>}
     * @memberof SmoothGradeStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace SmoothGradeStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SmoothGradeStream {
}

/**
 * 
 * @export
 * @interface SmoothVelocityStream
 */
export interface SmoothVelocityStream extends BaseStream {
    /**
     * The sequence of velocity values for this stream, in meters per second
     * @type {Array<number>}
     * @memberof SmoothVelocityStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace SmoothVelocityStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SmoothVelocityStream {
}

/**
 * 
 * @export
 * @interface Split
 */
export interface Split {
    /**
     * The average speed of this split, in meters per second
     * @type {number}
     * @memberof Split
     */
    averageSpeed?: number;
    /**
     * The distance of this split, in meters
     * @type {number}
     * @memberof Split
     */
    distance?: number;
    /**
     * The elapsed time of this split, in seconds
     * @type {number}
     * @memberof Split
     */
    elapsedTime?: number;
    /**
     * The elevation difference of this split, in meters
     * @type {number}
     * @memberof Split
     */
    elevationDifference?: number;
    /**
     * The pacing zone of this split
     * @type {number}
     * @memberof Split
     */
    paceZone?: number;
    /**
     * The moving time of this split, in seconds
     * @type {number}
     * @memberof Split
     */
    movingTime?: number;
    /**
     * N/A
     * @type {number}
     * @memberof Split
     */
    split?: number;
}

/**
 * An enumeration of the sport types an activity may have. Distinct from ActivityType in that it has new types (e.g. MountainBikeRide)
 * @export
 * @enum {string}
 */
export enum SportType {
    AlpineSki = 'AlpineSki',
    BackcountrySki = 'BackcountrySki',
    Badminton = 'Badminton',
    Canoeing = 'Canoeing',
    Crossfit = 'Crossfit',
    EBikeRide = 'EBikeRide',
    Elliptical = 'Elliptical',
    EMountainBikeRide = 'EMountainBikeRide',
    Golf = 'Golf',
    GravelRide = 'GravelRide',
    Handcycle = 'Handcycle',
    HighIntensityIntervalTraining = 'HighIntensityIntervalTraining',
    Hike = 'Hike',
    IceSkate = 'IceSkate',
    InlineSkate = 'InlineSkate',
    Kayaking = 'Kayaking',
    Kitesurf = 'Kitesurf',
    MountainBikeRide = 'MountainBikeRide',
    NordicSki = 'NordicSki',
    Pickleball = 'Pickleball',
    Pilates = 'Pilates',
    Racquetball = 'Racquetball',
    Ride = 'Ride',
    RockClimbing = 'RockClimbing',
    RollerSki = 'RollerSki',
    Rowing = 'Rowing',
    Run = 'Run',
    Sail = 'Sail',
    Skateboard = 'Skateboard',
    Snowboard = 'Snowboard',
    Snowshoe = 'Snowshoe',
    Soccer = 'Soccer',
    Squash = 'Squash',
    StairStepper = 'StairStepper',
    StandUpPaddling = 'StandUpPaddling',
    Surfing = 'Surfing',
    Swim = 'Swim',
    TableTennis = 'TableTennis',
    Tennis = 'Tennis',
    TrailRun = 'TrailRun',
    Velomobile = 'Velomobile',
    VirtualRide = 'VirtualRide',
    VirtualRow = 'VirtualRow',
    VirtualRun = 'VirtualRun',
    Walk = 'Walk',
    WeightTraining = 'WeightTraining',
    Wheelchair = 'Wheelchair',
    Windsurf = 'Windsurf',
    Workout = 'Workout',
    Yoga = 'Yoga'
}

/**
 * 
 * @export
 * @interface StreamSet
 */
export interface StreamSet {
    /**
     * 
     * @type {TimeStream}
     * @memberof StreamSet
     */
    time?: TimeStream;
    /**
     * 
     * @type {DistanceStream}
     * @memberof StreamSet
     */
    distance?: DistanceStream;
    /**
     * 
     * @type {LatLngStream}
     * @memberof StreamSet
     */
    latlng?: LatLngStream;
    /**
     * 
     * @type {AltitudeStream}
     * @memberof StreamSet
     */
    altitude?: AltitudeStream;
    /**
     * 
     * @type {SmoothVelocityStream}
     * @memberof StreamSet
     */
    velocitySmooth?: SmoothVelocityStream;
    /**
     * 
     * @type {HeartrateStream}
     * @memberof StreamSet
     */
    heartrate?: HeartrateStream;
    /**
     * 
     * @type {CadenceStream}
     * @memberof StreamSet
     */
    cadence?: CadenceStream;
    /**
     * 
     * @type {PowerStream}
     * @memberof StreamSet
     */
    watts?: PowerStream;
    /**
     * 
     * @type {TemperatureStream}
     * @memberof StreamSet
     */
    temp?: TemperatureStream;
    /**
     * 
     * @type {MovingStream}
     * @memberof StreamSet
     */
    moving?: MovingStream;
    /**
     * 
     * @type {SmoothGradeStream}
     * @memberof StreamSet
     */
    gradeSmooth?: SmoothGradeStream;
}

/**
 * 
 * @export
 * @interface SummaryActivity
 */
export interface SummaryActivity extends MetaActivity {
    /**
     * The identifier provided at upload time
     * @type {string}
     * @memberof SummaryActivity
     */
    externalId?: string;
    /**
     * The identifier of the upload that resulted in this activity
     * @type {number}
     * @memberof SummaryActivity
     */
    uploadId?: number;
    /**
     * 
     * @type {MetaAthlete}
     * @memberof SummaryActivity
     */
    athlete?: MetaAthlete;
    /**
     * The name of the activity
     * @type {string}
     * @memberof SummaryActivity
     */
    name?: string;
    /**
     * The activity's distance, in meters
     * @type {number}
     * @memberof SummaryActivity
     */
    distance?: number;
    /**
     * The activity's moving time, in seconds
     * @type {number}
     * @memberof SummaryActivity
     */
    movingTime?: number;
    /**
     * The activity's elapsed time, in seconds
     * @type {number}
     * @memberof SummaryActivity
     */
    elapsedTime?: number;
    /**
     * The activity's total elevation gain.
     * @type {number}
     * @memberof SummaryActivity
     */
    totalElevationGain?: number;
    /**
     * The activity's highest elevation, in meters
     * @type {number}
     * @memberof SummaryActivity
     */
    elevHigh?: number;
    /**
     * The activity's lowest elevation, in meters
     * @type {number}
     * @memberof SummaryActivity
     */
    elevLow?: number;
    /**
     * Deprecated. Prefer to use sport_type
     * @type {ActivityType}
     * @memberof SummaryActivity
     */
    type?: ActivityType;
    /**
     * 
     * @type {SportType}
     * @memberof SummaryActivity
     */
    sportType?: SportType;
    /**
     * The time at which the activity was started.
     * @type {Date}
     * @memberof SummaryActivity
     */
    startDate?: Date;
    /**
     * The time at which the activity was started in the local timezone.
     * @type {Date}
     * @memberof SummaryActivity
     */
    startDateLocal?: Date;
    /**
     * The timezone of the activity
     * @type {string}
     * @memberof SummaryActivity
     */
    timezone?: string;
    /**
     * 
     * @type {LatLng}
     * @memberof SummaryActivity
     */
    startLatlng?: LatLng;
    /**
     * 
     * @type {LatLng}
     * @memberof SummaryActivity
     */
    endLatlng?: LatLng;
    /**
     * The number of achievements gained during this activity
     * @type {number}
     * @memberof SummaryActivity
     */
    achievementCount?: number;
    /**
     * The number of kudos given for this activity
     * @type {number}
     * @memberof SummaryActivity
     */
    kudosCount?: number;
    /**
     * The number of comments for this activity
     * @type {number}
     * @memberof SummaryActivity
     */
    commentCount?: number;
    /**
     * The number of athletes for taking part in a group activity
     * @type {number}
     * @memberof SummaryActivity
     */
    athleteCount?: number;
    /**
     * The number of Instagram photos for this activity
     * @type {number}
     * @memberof SummaryActivity
     */
    photoCount?: number;
    /**
     * The number of Instagram and Strava photos for this activity
     * @type {number}
     * @memberof SummaryActivity
     */
    totalPhotoCount?: number;
    /**
     * 
     * @type {PolylineMap}
     * @memberof SummaryActivity
     */
    map?: PolylineMap;
    /**
     * Whether this activity was recorded on a training machine
     * @type {boolean}
     * @memberof SummaryActivity
     */
    trainer?: boolean;
    /**
     * Whether this activity is a commute
     * @type {boolean}
     * @memberof SummaryActivity
     */
    commute?: boolean;
    /**
     * Whether this activity was created manually
     * @type {boolean}
     * @memberof SummaryActivity
     */
    manual?: boolean;
    /**
     * Whether this activity is private
     * @type {boolean}
     * @memberof SummaryActivity
     */
    _private?: boolean;
    /**
     * Whether this activity is flagged
     * @type {boolean}
     * @memberof SummaryActivity
     */
    flagged?: boolean;
    /**
     * The activity's workout type
     * @type {number}
     * @memberof SummaryActivity
     */
    workoutType?: number;
    /**
     * The unique identifier of the upload in string format
     * @type {string}
     * @memberof SummaryActivity
     */
    uploadIdStr?: string;
    /**
     * The activity's average speed, in meters per second
     * @type {number}
     * @memberof SummaryActivity
     */
    averageSpeed?: number;
    /**
     * The activity's max speed, in meters per second
     * @type {number}
     * @memberof SummaryActivity
     */
    maxSpeed?: number;
    /**
     * Whether the logged-in athlete has kudoed this activity
     * @type {boolean}
     * @memberof SummaryActivity
     */
    hasKudoed?: boolean;
    /**
     * Whether the activity is muted
     * @type {boolean}
     * @memberof SummaryActivity
     */
    hideFromHome?: boolean;
    /**
     * The id of the gear for the activity
     * @type {string}
     * @memberof SummaryActivity
     */
    gearId?: string;
    /**
     * The total work done in kilojoules during this activity. Rides only
     * @type {number}
     * @memberof SummaryActivity
     */
    kilojoules?: number;
    /**
     * Average power output in watts during this activity. Rides only
     * @type {number}
     * @memberof SummaryActivity
     */
    averageWatts?: number;
    /**
     * Whether the watts are from a power meter, false if estimated
     * @type {boolean}
     * @memberof SummaryActivity
     */
    deviceWatts?: boolean;
    /**
     * Rides with power meter data only
     * @type {number}
     * @memberof SummaryActivity
     */
    maxWatts?: number;
    /**
     * Similar to Normalized Power. Rides with power meter data only
     * @type {number}
     * @memberof SummaryActivity
     */
    weightedAverageWatts?: number;
}

/**
 * 
 * @export
 * @interface SummaryAthlete
 */
export interface SummaryAthlete extends MetaAthlete {
    /**
     * Id of Athlete
     * @type {number}
     * @memberof SummaryAthlete
     */
    id?: number;
    /**
     * Resource state, indicates level of detail. Possible values: 1 -> \"meta\", 2 -> \"summary\", 3 -> \"detail\"
     * @type {number}
     * @memberof SummaryAthlete
     */
    resourceState?: number;
    /**
     * The athlete's first name.
     * @type {string}
     * @memberof SummaryAthlete
     */
    firstname?: string;
    /**
     * The athlete's last name.
     * @type {string}
     * @memberof SummaryAthlete
     */
    lastname?: string;
    /**
     * URL to a 62x62 pixel profile picture.
     * @type {string}
     * @memberof SummaryAthlete
     */
    profileMedium?: string;
    /**
     * URL to a 124x124 pixel profile picture.
     * @type {string}
     * @memberof SummaryAthlete
     */
    profile?: string;
    /**
     * The athlete's city.
     * @type {string}
     * @memberof SummaryAthlete
     */
    city?: string;
    /**
     * The athlete's state or geographical region.
     * @type {string}
     * @memberof SummaryAthlete
     */
    state?: string;
    /**
     * The athlete's country.
     * @type {string}
     * @memberof SummaryAthlete
     */
    country?: string;
    /**
     * The athlete's sex.
     * @type {string}
     * @memberof SummaryAthlete
     */
    sex?: SummaryAthlete.SexEnum;
    /**
     * Deprecated.  Use summit field instead. Whether the athlete has unknown Summit subscription.
     * @type {boolean}
     * @memberof SummaryAthlete
     */
    premium?: boolean;
    /**
     * Whether the athlete has unknown Summit subscription.
     * @type {boolean}
     * @memberof SummaryAthlete
     */
    summit?: boolean;
    /**
     * The time at which the athlete was created.
     * @type {Date}
     * @memberof SummaryAthlete
     */
    createdAt?: Date;
    /**
     * The time at which the athlete was last updated.
     * @type {Date}
     * @memberof SummaryAthlete
     */
    updatedAt?: Date;
}

/**
 * @export
 * @namespace SummaryAthlete
 */

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SummaryAthlete {
    /**
     * @export
     * @enum {string}
     */
    export enum SexEnum {
        M = 'M',
        F = 'F'
    }
}

/**
 * 
 * @export
 * @interface SummaryClub
 */
export interface SummaryClub extends MetaClub {
    /**
     * URL to a 60x60 pixel profile picture.
     * @type {string}
     * @memberof SummaryClub
     */
    profileMedium?: string;
    /**
     * URL to a ~1185x580 pixel cover photo.
     * @type {string}
     * @memberof SummaryClub
     */
    coverPhoto?: string;
    /**
     * URL to a ~360x176  pixel cover photo.
     * @type {string}
     * @memberof SummaryClub
     */
    coverPhotoSmall?: string;
    /**
     * Deprecated. Prefer to use activity_types.
     * @type {string}
     * @memberof SummaryClub
     */
    sportType?: SummaryClub.SportTypeEnum;
    /**
     * The activity types that count for a club. This takes precedence over sport_type.
     * @type {Array<ActivityType>}
     * @memberof SummaryClub
     */
    activityTypes?: Array<ActivityType>;
    /**
     * The club's city.
     * @type {string}
     * @memberof SummaryClub
     */
    city?: string;
    /**
     * The club's state or geographical region.
     * @type {string}
     * @memberof SummaryClub
     */
    state?: string;
    /**
     * The club's country.
     * @type {string}
     * @memberof SummaryClub
     */
    country?: string;
    /**
     * Whether the club is private.
     * @type {boolean}
     * @memberof SummaryClub
     */
    _private?: boolean;
    /**
     * The club's member count.
     * @type {number}
     * @memberof SummaryClub
     */
    memberCount?: number;
    /**
     * Whether the club is featured or not.
     * @type {boolean}
     * @memberof SummaryClub
     */
    featured?: boolean;
    /**
     * Whether the club is verified or not.
     * @type {boolean}
     * @memberof SummaryClub
     */
    verified?: boolean;
    /**
     * The club's vanity URL.
     * @type {string}
     * @memberof SummaryClub
     */
    url?: string;
}

/**
 * @export
 * @namespace SummaryClub
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SummaryClub {
    /**
     * @export
     * @enum {string}
     */
    export enum SportTypeEnum {
        Cycling = 'cycling',
        Running = 'running',
        Triathlon = 'triathlon',
        Other = 'other'
    }
}

/**
 * 
 * @export
 * @interface SummaryGear
 */
export interface SummaryGear {
    /**
     * The gear's unique identifier.
     * @type {string}
     * @memberof SummaryGear
     */
    id?: string;
    /**
     * Resource state, indicates level of detail. Possible values: 2 -> \"summary\", 3 -> \"detail\"
     * @type {number}
     * @memberof SummaryGear
     */
    resourceState?: number;
    /**
     * Whether this gear's is the owner's default one.
     * @type {boolean}
     * @memberof SummaryGear
     */
    primary?: boolean;
    /**
     * The gear's name.
     * @type {string}
     * @memberof SummaryGear
     */
    name?: string;
    /**
     * The distance logged with this gear.
     * @type {number}
     * @memberof SummaryGear
     */
    distance?: number;
}

/**
 * 
 * @export
 * @interface SummaryPRSegmentEffort
 */
export interface SummaryPRSegmentEffort {
    /**
     * The unique identifier of the activity related to the PR effort.
     * @type {number}
     * @memberof SummaryPRSegmentEffort
     */
    prActivityId?: number;
    /**
     * The elapsed time ot the PR effort.
     * @type {number}
     * @memberof SummaryPRSegmentEffort
     */
    prElapsedTime?: number;
    /**
     * The time at which the PR effort was started.
     * @type {Date}
     * @memberof SummaryPRSegmentEffort
     */
    prDate?: Date;
    /**
     * Number of efforts by the authenticated athlete on this segment.
     * @type {number}
     * @memberof SummaryPRSegmentEffort
     */
    effortCount?: number;
}

/**
 * 
 * @export
 * @interface SummarySegment
 */
export interface SummarySegment {
    /**
     * The unique identifier of this segment
     * @type {number}
     * @memberof SummarySegment
     */
    id?: number;
    /**
     * The name of this segment
     * @type {string}
     * @memberof SummarySegment
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof SummarySegment
     */
    activityType?: SummarySegment.ActivityTypeEnum;
    /**
     * The segment's distance, in meters
     * @type {number}
     * @memberof SummarySegment
     */
    distance?: number;
    /**
     * The segment's average grade, in percents
     * @type {number}
     * @memberof SummarySegment
     */
    averageGrade?: number;
    /**
     * The segments's maximum grade, in percents
     * @type {number}
     * @memberof SummarySegment
     */
    maximumGrade?: number;
    /**
     * The segments's highest elevation, in meters
     * @type {number}
     * @memberof SummarySegment
     */
    elevationHigh?: number;
    /**
     * The segments's lowest elevation, in meters
     * @type {number}
     * @memberof SummarySegment
     */
    elevationLow?: number;
    /**
     * 
     * @type {LatLng}
     * @memberof SummarySegment
     */
    startLatlng?: LatLng;
    /**
     * 
     * @type {LatLng}
     * @memberof SummarySegment
     */
    endLatlng?: LatLng;
    /**
     * The category of the climb [0, 5]. Higher is harder ie. 5 is Hors catégorie, 0 is uncategorized in climb_category.
     * @type {number}
     * @memberof SummarySegment
     */
    climbCategory?: number;
    /**
     * The segments's city.
     * @type {string}
     * @memberof SummarySegment
     */
    city?: string;
    /**
     * The segments's state or geographical region.
     * @type {string}
     * @memberof SummarySegment
     */
    state?: string;
    /**
     * The segment's country.
     * @type {string}
     * @memberof SummarySegment
     */
    country?: string;
    /**
     * Whether this segment is private.
     * @type {boolean}
     * @memberof SummarySegment
     */
    _private?: boolean;
    /**
     * 
     * @type {SummaryPRSegmentEffort}
     * @memberof SummarySegment
     */
    athletePrEffort?: SummaryPRSegmentEffort;
    /**
     * 
     * @type {SummarySegmentEffort}
     * @memberof SummarySegment
     */
    athleteSegmentStats?: SummarySegmentEffort;
}

/**
 * @export
 * @namespace SummarySegment
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SummarySegment {
    /**
     * @export
     * @enum {string}
     */
    export enum ActivityTypeEnum {
        Ride = 'Ride',
        Run = 'Run'
    }
}

/**
 * 
 * @export
 * @interface SummarySegmentEffort
 */
export interface SummarySegmentEffort {
    /**
     * The unique identifier of this effort
     * @type {number}
     * @memberof SummarySegmentEffort
     */
    id?: number;
    /**
     * The unique identifier of the activity related to this effort
     * @type {number}
     * @memberof SummarySegmentEffort
     */
    activityId?: number;
    /**
     * The effort's elapsed time
     * @type {number}
     * @memberof SummarySegmentEffort
     */
    elapsedTime?: number;
    /**
     * The time at which the effort was started.
     * @type {Date}
     * @memberof SummarySegmentEffort
     */
    startDate?: Date;
    /**
     * The time at which the effort was started in the local timezone.
     * @type {Date}
     * @memberof SummarySegmentEffort
     */
    startDateLocal?: Date;
    /**
     * The effort's distance in meters
     * @type {number}
     * @memberof SummarySegmentEffort
     */
    distance?: number;
    /**
     * Whether this effort is the current best on the leaderboard
     * @type {boolean}
     * @memberof SummarySegmentEffort
     */
    isKom?: boolean;
}

/**
 * 
 * @export
 * @interface TemperatureStream
 */
export interface TemperatureStream extends BaseStream {
    /**
     * The sequence of temperature values for this stream, in celsius degrees
     * @type {Array<number>}
     * @memberof TemperatureStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace TemperatureStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TemperatureStream {
}

/**
 * 
 * @export
 * @interface TimeStream
 */
export interface TimeStream extends BaseStream {
    /**
     * The sequence of time values for this stream, in seconds
     * @type {Array<number>}
     * @memberof TimeStream
     */
    data?: Array<number>;
}

/**
 * @export
 * @namespace TimeStream
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TimeStream {
}

/**
 * Stores the exclusive ranges representing zones and the time spent in each.
 * @export
 * @interface TimedZoneDistribution
 */
export interface TimedZoneDistribution extends Array<TimedZoneRange> {
}

/**
 * A union type representing the time spent in a given zone.
 * @export
 * @interface TimedZoneRange
 */
export interface TimedZoneRange extends ZoneRange {
    /**
     * The number of seconds spent in this zone
     * @type {number}
     * @memberof TimedZoneRange
     */
    time?: number;
}

/**
 * 
 * @export
 * @interface UpdatableActivity
 */
export interface UpdatableActivity {
    /**
     * Whether this activity is a commute
     * @type {boolean}
     * @memberof UpdatableActivity
     */
    commute?: boolean;
    /**
     * Whether this activity was recorded on a training machine
     * @type {boolean}
     * @memberof UpdatableActivity
     */
    trainer?: boolean;
    /**
     * Whether this activity is muted
     * @type {boolean}
     * @memberof UpdatableActivity
     */
    hideFromHome?: boolean;
    /**
     * The description of the activity
     * @type {string}
     * @memberof UpdatableActivity
     */
    description?: string;
    /**
     * The name of the activity
     * @type {string}
     * @memberof UpdatableActivity
     */
    name?: string;
    /**
     * Deprecated. Prefer to use sport_type. In a request where both type and sport_type are present, this field will be ignored
     * @type {ActivityType}
     * @memberof UpdatableActivity
     */
    type?: ActivityType;
    /**
     * 
     * @type {SportType}
     * @memberof UpdatableActivity
     */
    sportType?: SportType;
    /**
     * Identifier for the gear associated with the activity. ‘none’ clears gear from activity
     * @type {string}
     * @memberof UpdatableActivity
     */
    gearId?: string;
}

/**
 * 
 * @export
 * @interface Upload
 */
export interface Upload {
    /**
     * The unique identifier of the upload
     * @type {number}
     * @memberof Upload
     */
    id?: number;
    /**
     * The unique identifier of the upload in string format
     * @type {string}
     * @memberof Upload
     */
    idStr?: string;
    /**
     * The external identifier of the upload
     * @type {string}
     * @memberof Upload
     */
    externalId?: string;
    /**
     * The error associated with this upload
     * @type {string}
     * @memberof Upload
     */
    error?: string;
    /**
     * The status of this upload
     * @type {string}
     * @memberof Upload
     */
    status?: string;
    /**
     * The identifier of the activity this upload resulted into
     * @type {number}
     * @memberof Upload
     */
    activityId?: number;
}

/**
 * 
 * @export
 * @interface ZoneRange
 */
export interface ZoneRange {
    /**
     * The minimum value in the range.
     * @type {number}
     * @memberof ZoneRange
     */
    min?: number;
    /**
     * The maximum value in the range.
     * @type {number}
     * @memberof ZoneRange
     */
    max?: number;
}

/**
 * 
 * @export
 * @interface ZoneRanges
 */
export interface ZoneRanges extends Array<ZoneRange> {
}

/**
 * 
 * @export
 * @interface Zones
 */
export interface Zones {
    /**
     * 
     * @type {HeartRateZoneRanges}
     * @memberof Zones
     */
    heartRate?: HeartRateZoneRanges;
    /**
     * 
     * @type {PowerZoneRanges}
     * @memberof Zones
     */
    power?: PowerZoneRanges;
}

