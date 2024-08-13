import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { new_club_schema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { FriendshipStatus, type club } from '@prisma/client';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const clubSchema = await superValidate(zod(new_club_schema));

	return { ...data, clubSchema };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(new_club_schema));
		let t: ToastSettings;
		let new_club: club;
		try {
			new_club = await prisma.$transaction(async (db) => {
				let club = await db.club.create({
					data: {
						...form.data
					}
				});
				await db.club_member.create({
					data: {
						club_id: club.id,
						user_id: locals.user!.id,
						status: FriendshipStatus.ACCEPTED,
						admin: true
					}
				});
				return club;
			});

			t = {
				message: `Successfully Created ${new_club.name}`,
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			t = {
				message: 'Failed to create club',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		redirect(`/clubs/${new_club.id}`, t, event);
	}
};
