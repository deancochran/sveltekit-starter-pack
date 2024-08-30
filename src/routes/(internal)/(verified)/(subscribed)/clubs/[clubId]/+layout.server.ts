import { db } from '$lib/drizzle/client';
import { club, clubMember } from '$lib/drizzle/schema';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect as r } from '@sveltejs/kit';
import { and, count, eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async (event) => {
	const { parent, params, locals } = event;
	const data = await parent();

	if (!data.user) r(302, handleSignInRedirect(event));
	const _club = await db
		.select({
			club: club,
			memberCount: count(clubMember)
		})
		.from(club)
		.where(eq(club.id, Number(params.clubId)))
		.leftJoin(
			clubMember,
			and(
				eq(clubMember.clubId, Number(params.clubId)),
				eq(clubMember.status, 'ACCEPTED')
			)
		);
	const clubProfile = _club.at(0);
	if (!clubProfile) {
		const t: ToastSettings = {
			message: 'Failed to find session',
			background: 'variant-filled-error'
		} as const;
		redirect(`/sessions`, t, event);
	}

	const userMembership = await db.query.clubMember.findFirst({
		where: and(
			eq(clubMember.userId, data.user.id),
			eq(clubMember.clubId, clubProfile.club.id)
		)
	});
	return {
		...data,
		club: clubProfile.club,
		userMembership
	};
};
