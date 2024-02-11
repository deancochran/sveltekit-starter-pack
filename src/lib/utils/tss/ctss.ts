export function calc_cTss(S:number, NP:number, FTP:number){
    // returns effort score 0-X (X>=100)
    const INTENSITY_FACTOR = NP/FTP
    const EFFORT_POWER_OUTPUT = S * NP * INTENSITY_FACTOR
    const MAX_HOUR_FTP_POWER_OUTPUT = FTP * 3600
    return (EFFORT_POWER_OUTPUT/MAX_HOUR_FTP_POWER_OUTPUT)*100
}