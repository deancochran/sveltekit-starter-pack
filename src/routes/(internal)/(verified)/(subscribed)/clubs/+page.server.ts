import { db } from '$lib/drizzle/client';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

import { club, clubMember } from '$lib/drizzle/schema';
import { redirect as r } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	if (!data.user) r(302, handleSignInRedirect(event));
	const userMemberships = await db.query.clubMember.findMany({
		where: eq(clubMember.userId, data.user?.id),
		with: {
			club: true
		}
	});
	const clubs = await db
		.select({ club, memberCount: count(clubMember) })
		.from(club)
		.leftJoin(clubMember, eq(club.id, clubMember.clubId))
		.limit(5);
	const [clubsCount] = await db.select({ count: count(club) }).from(club);

	return {
		...data,
		userMemberships,
		clubs,
		clubsCount
	};
};
