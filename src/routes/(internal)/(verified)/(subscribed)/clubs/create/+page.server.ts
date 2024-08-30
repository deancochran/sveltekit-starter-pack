import { newClubSchema } from '$lib/schemas';
import { db } from '$lib/drizzle/client';
import { club, clubMember } from '$lib/drizzle/schema';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import type { InferInsertModel } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const clubSchema = await superValidate(zod(newClubSchema));

	return { ...data, clubSchema };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(newClubSchema));
		let t: ToastSettings;
		let newClub: InferInsertModel<typeof club>;
		try {
			newClub = await db.transaction(async (ctx) => {
				const [_club] = await ctx
					.insert(club)
					.values({
						name: form.data.name,
						description: form.data.description,
						updatedAt: new Date(),
						private: form.data.private
					})
					.returning();
				await ctx.insert(clubMember).values({
					clubId: _club.id,
					userId: locals.user!.id,
					status: 'ACCEPTED',
					admin: true,
					updatedAt: new Date()
				});
				return _club;
			});

			t = {
				message: `Successfully Created ${newClub.name}`,
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
		redirect(`/clubs/${newClub.id}`, t, event);
	}
};
