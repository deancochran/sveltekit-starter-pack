import type { activities } from "@prisma/client";
import type { PageServerLoad } from "./$types";

export type StressDays = {
    [local_date: string]: {
        stress_score: number,
        activities: activities[]
    }
}

function generateDateRange(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in days
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const timeDifference = end - start;
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

    // Generate an array of dates
    const dateArray = [];
    for (let i = 1; i <= dayDifference; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        dateArray.push(currentDate.toLocaleDateString());
    }

    return dateArray;
}




export const load: PageServerLoad = async ({ parent }) => {
    await parent();
    const data = await parent();
    const user = await prisma.user.findUnique({
        where: {
            id: data.session.user.userId,
        },
        include: {
            activities: {
                orderBy: {
                    date: 'asc'
                },
            },
        },
    });
    const agg_activities: StressDays = {}
    user!.activities.forEach((act, i) => {
        const date = act.date.toLocaleDateString()
        if (Object.keys(agg_activities).includes(date)) {
            const current = agg_activities[date]
            agg_activities[date] = { stress_score: current.stress_score + act.stress_score.toNumber(), activities: [act, ...current.activities] }
        } else {
            agg_activities[date] = { stress_score: act.stress_score.toNumber(), activities: [act] }
        }
        if (user!.activities.at(i + 1)) {
            const endDate = user!.activities[i + 1].date.toLocaleDateString()
            const dateRange = generateDateRange(date, endDate);
            dateRange.forEach((dateString) => {
                agg_activities[dateString] = { stress_score: 0, activities: [] }
            })
        }
        console.log(agg_activities)
    })



    return {
        user,
        agg_activities,
        ...data
    }
}
