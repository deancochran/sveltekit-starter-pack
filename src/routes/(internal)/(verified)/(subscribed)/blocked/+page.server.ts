import { db } from '$lib/drizzle/client';
import { activities, user } from '$lib/drizzle/schema';
import { redirect } from '@sveltejs/kit';
import { asc, eq, type InferSelectModel } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export type StressDays = {
	[local_date: string]: {
		stressScore: number;
		activities: InferSelectModel<typeof activities>[];
	};
};

// function generateDateRange(startDate: string, endDate: string) {
// 	const start = new Date(startDate);
// 	const end = new Date(endDate);

// 	// Calculate the difference in days
// 	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// 	//@ts-expect-error
// 	const timeDifference = end - start;
// 	const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

// 	// Generate an array of dates
// 	const dateArray = [];
// 	for (let i = 1; i <= dayDifference; i++) {
// 		const currentDate = new Date(start);
// 		currentDate.setDate(start.getDate() + i);
// 		dateArray.push(currentDate.toLocaleDateString());
// 	}

// 	return dateArray;
// }

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	if (!data.user) redirect(302, 'login');
	const _user = await db.query.user.findFirst({
		where: eq(user.id, data.user.id),
		with: {
			activities: {
				orderBy: [asc(activities.date)]
			}
		}
	});
	if (!_user) throw new Error('No user found');

	const aggActivities: StressDays = {};
	// _user.activities.forEach((act, i) => {
	// 	const date = act.date.toLocaleDateString();
	// 	if (Object.keys(aggActivities).includes(date)) {
	// 		const current = aggActivities[date];
	// 		aggActivities[date] = {
	// 			stressScore: current.stressScore + act.stressScore,
	// 			activities: [act, ...current.activities]
	// 		};
	// 	} else {
	// 		aggActivities[date] = { stressScore: act.stressScore, activities: [act] };
	// 	}
	// 	if (_user.activities.at(i + 1)) {
	// 		const endDate = _user.activities[i + 1].date.toLocaleDateString();
	// 		const dateRange = generateDateRange(date, endDate);
	// 		dateRange.forEach((dateString) => {
	// 			aggActivities[dateString] = { stressScore: 0, activities: [] };
	// 		});
	// 	}
	// });

	return {
		aggActivities,
		...data
	};
};
