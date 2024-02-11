import { SportType } from "../integrations/strava/typescript-fetch-client/models";

const YARDS_PER_METER: number = 1.09361;
const METERS_PER_100m: number = 100;
const YARDS_PER_100m: number = METERS_PER_100m*YARDS_PER_METER;
export const valid_sTss_sport_types = [SportType.Swim]

export function calcSwimPace(metersParam:number, secondsParam:number, imperial=false){

    if (imperial) {
        // Convert meters to yards
        const distanceYards: number = metersParam * YARDS_PER_METER;

        /// Calculate pace in minutes per 100 meters
        const total_100s=(distanceYards / YARDS_PER_100m);
        const elapsed_mins=(secondsParam / 60)
        const paceMinutesPer100y: number = elapsed_mins / total_100s;

        return paceMinutesPer100y
    } else {
        // Calculate pace in minutes per 100 meters
        const total_100s=(metersParam / METERS_PER_100m);
        const elapsed_mins=(secondsParam / 60)
        const paceMinutesPer100m: number =  elapsed_mins/total_100s
        return paceMinutesPer100m
    }
}

export function calc_sTss(S:number, NP:number, FTP:number, imperial=false){
    // Convert paces to speeds (yards per minute or meters per minute)
    const INTENSITY_FACTOR = FTP/NP
    const elapsed_hrs=S /60 / 60
    // Calculate Swim TSS
    return Math.pow(INTENSITY_FACTOR, 3) * elapsed_hrs * 100
}

