import { db } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (!data.user) throw new Error('No user found');
	const trainingSessions = await db.query.trainingSession.findMany({
		where: eq(user.id, data.user.id)
	});

	return {
		...data,
		trainingSessions
	};
};
