import { user_feed_schema } from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from 'assert';
import dayjs from 'dayjs';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const items = await prisma.club_event.findMany({
		where: {
			date: {
				gte: dayjs().add(-1, 'day').toDate()
			}
		},
		take: 5,
		skip: 0,
		include: {
			training_session: true,
			club: true
		}
	});
	const items_count = await prisma.club_event.count({
		where: {
			date: {
				gte: dayjs().toDate()
			}
		}
	});
	const user_feed_form = await superValidate(
		{
			page: 0,
			limit: 5,
			size: items_count,
			amounts: [5]
		},
		zod(user_feed_schema)
	);
	return {
		user_feed_form,
		init_items: items,
		...data
	};
};

export const actions: Actions = {
	default: async (event): Promise<{ form: any; new_items: Array<any> }> => {
		const { request } = event;
		const form = await superValidate(request, zod(user_feed_schema));

		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const skip = form.data.page * form.data.limit;
			const new_items = await prisma.club_event.findMany({
				where: {
					date: {
						gte: dayjs().toDate()
					}
				},
				take: 5,
				skip: skip,
				include: {
					training_session: true
				}
			});
			return { form, new_items };
		} catch (e) {
			const t: ToastSettings = {
				message: 'Failed to delete account',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
		}
		return fail(400, { form, new_items: [] });
	}
};
