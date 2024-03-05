import { addDays } from '$lib/utils/datetime';
import { ActivityType, type calendar, type event, type trainingPlan, type user } from '@prisma/client';


export interface NewEvent extends Omit<event, 'id' | 'start' | 'end'> {
    id?: number;
    start?: Date;
    end?: Date;
}


export function marathon_plan(training_plan: trainingPlan & { user: user & { calendar: calendar } }, startDate: Date, weeks: number): Array<NewEvent> {
    const eventsData: Array<NewEvent> = [];

    // Generate a 6-week training plan with specific running workouts per day
    for (let week = 1; week <= weeks; week++) {
        const weekStartDate = addDays(startDate, (week - 1) * 7);

        // Schedule specific running workouts for each day
        eventsData.push(
            {
                eventType: ActivityType.RUN,
                title: `Long Run`,
                description: 'Run a long distance at an steady pace.',
                date: addDays(weekStartDate, 0),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
            {
                eventType: ActivityType.RUN,
                title: `Short Run`,
                description: 'Run a short distance at an easy pace.',
                date: addDays(weekStartDate, 1),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
            {
                eventType: ActivityType.RUN,
                title: `Track Run`,
                description: 'Run a medium distance at a fast pace.',
                date: addDays(weekStartDate, 2),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
            {
                eventType: ActivityType.RUN,
                title: `Long Run`,
                description: 'Run a long distance at a easy pace.',
                date: addDays(weekStartDate, 3),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
            {
                eventType: ActivityType.RUN,
                title: `Track Run`,
                description: 'Run a medium distance at a fast pace.',
                date: addDays(weekStartDate, 4),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
            {
                eventType: ActivityType.RUN,
                title: `Short Run`,
                description: 'Run a short distance at an easy pace.',
                date: addDays(weekStartDate, 5),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
            {
                eventType: ActivityType.RUN,
                title: `Short Run`,
                description: 'Run a short distance at an easy pace.',
                date: addDays(weekStartDate, 6),
                all_day: true,
                calendar_id: training_plan.user.calendar.id,
                training_plan_id: training_plan.id
            },
        );
    }

    return eventsData;
}
