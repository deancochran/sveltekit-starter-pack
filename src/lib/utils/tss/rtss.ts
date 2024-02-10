// https://www.trainingpeaks.com/learn/articles/running-training-stress-score-rtss-explained/
// https://medium.com/strava-engineering/improving-grade-adjusted-pace-b9a2a332a5dc
// https://medium.com/strava-engineering/an-improved-gap-model-8b07ae8886c3
// https://github.com/andrewhao/stressfactor


// The most useful tools to quantify how hard you're training are those that account for both the volume and the intensity of your running.
// Running Training Stress ScoreTM (rTSS) is a trademark metric of TrainingPeaks

// Since running speed is function of power, and for most runners, speed or pace is the measure of greatest interest, we can use the same principles applied in the TSS system to quantify training stress in running. In particular, the elements of the normalized graded pace (NGP; info here), relative to the functional threshold pace (FTP; info here) in conjunction with the duration of the workout we can determine an appropriate rTSS score for each workout.

//s:number= duration of workout in seconds
//ngP:number= normalized graded pace (pace adjusted for elevation)
//iF:number= intensity factor (how hard the workout is compared to your threshold)
//ftp:number= functional threshold pace (avg pace you can hold when running all out for one hour)
//s:number= duration of workout in seconds


export type rTssParams = {
    s:number
}

export function rTss(params:rTssParams):number{
    //unfinished
    return params.s
}