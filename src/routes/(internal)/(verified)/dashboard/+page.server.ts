import { getMostRecentSunday } from '$lib/utils/datetime';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const data = await parent();
	// get all activities in the past week
	const mostRecentSunday = getMostRecentSunday();
	const activities = await prisma.activities.findMany({
		where: {
			user_id: data.user!.id,
			date: {
				gte: mostRecentSunday
			}
		},
		orderBy: {
			date: 'asc'
		}
	});
	return {
		activities,
		...data
	};
};
