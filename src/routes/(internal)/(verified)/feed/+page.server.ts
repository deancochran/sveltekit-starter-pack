import { userFeedSchema } from '$lib/schemas';
import { db } from '$lib/drizzle/client';
import { clubEvent } from '$lib/drizzle/schema';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from 'assert';
import dayjs from 'dayjs';
import { count, gte } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	// TODO change to a select query
	const items = await db.query.clubEvent.findMany({
		limit: 5,
		offset: 0,
		where: gte(clubEvent.date, dayjs().toDate()),
		with: {
			trainingSession: true,
			club: true
		}
	});
	const itemsCount = await db
		.select({ count: count(clubEvent) })
		.from(clubEvent);

	const userFeedForm = await superValidate(
		{
			page: 0,
			limit: 5,
			size: itemsCount[0].count,
			amounts: [5]
		},
		zod(userFeedSchema)
	);
	return {
		userFeedForm,
		init_items: items,
		...data
	};
};

export const actions: Actions = {
	default: async (event): Promise<{ form: any; newItems: Array<any> }> => {
		const { request } = event;
		const form = await superValidate(request, zod(userFeedSchema));

		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const skip = form.data.page * form.data.limit;
			const newItems = await db.query.clubEvent.findMany({
				limit: 5,
				offset: skip,
				where: gte(clubEvent.date, dayjs().toDate()),
				with: {
					trainingSession: true,
					club: true
				}
			});
			return { form, newItems };
		} catch (e) {
			const t: ToastSettings = {
				message: 'Failed to delete account',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
		}
		return fail(400, { form, newItems: [] });
	}
};
