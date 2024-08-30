import { db } from '$lib/drizzle/client';
import { clubEvent } from '$lib/drizzle/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const events = await db.query.clubEvent.findMany({
		where: eq(clubEvent.clubId, data.club.id),
		orderBy: [asc(clubEvent.date)]
	});

	return {
		...data,
		events
	};
};
