import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { FriendshipStatus } from '@prisma/client';
import type { PageServerLoad } from './$types';

import { redirect as r, type Actions } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	if (!data.user) r(302, handleSignInRedirect(event));
	const user_memberships = await prisma.club_member.findMany({
		where: {
			user_id: data.user?.id
		},
		include: {
			club: true
		}
	});
	const clubs = await prisma.club.findMany({
		take: 5,
		include: { _count: { select: { members: { where: { status: FriendshipStatus.ACCEPTED } } } } }
	});
	const clubs_count = await prisma.club.count();

	return {
		...data,
		user_memberships,
		clubs,
		clubs_count
	};
};
