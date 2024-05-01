export type ZwiftArchiveWorkoutInterval = [duration:number, intensity:number]

export enum ZwiftArchiveWorkoutCategory {
    RECOVERY='recovery',
    ENDURANCE='endurance',
    TEMPO="tempo",
    THRESHOLD='threshold',
    VO2='vo2',
    ANAEROBIC="anaerobic"


}
export type Zwift_Archive_Workout = {
    name:string,
    description: string,
    category:ZwiftArchiveWorkoutCategory
    intervals: Array<ZwiftArchiveWorkoutInterval>
}