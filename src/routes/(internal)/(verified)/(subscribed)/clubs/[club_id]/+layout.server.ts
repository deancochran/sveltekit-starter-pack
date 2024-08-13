import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect as r } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { FriendshipStatus } from '@prisma/client';
export const load: LayoutServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();

	if (!data.user) r(302, handleSignInRedirect(event));
	const club = await prisma.club.findFirst({
		where: {
			id: Number(params.club_id)
		},
		include: {
			_count: {
				select: {
					members: {
						where: {
							status: FriendshipStatus.ACCEPTED
						}
					}
				}
			}
		}
	});
	if (!club) {
		const t: ToastSettings = {
			message: 'Failed to find session',
			background: 'variant-filled-error'
		} as const;
		redirect(`/sessions`, t, event);
	}

	const user_membership = await prisma.club_member.findFirst({
		where: {
			user_id: data.user.id,
			club_id: club.id
		}
	});
	return {
		...data,
		club,
		user_membership
	};
};
