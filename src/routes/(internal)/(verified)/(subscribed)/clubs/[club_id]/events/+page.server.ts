import { type NewClubEventSchema, RecurrenceFrequency, new_club_event_schema } from '$lib/schemas';
import type { Prisma, club_event } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type Actions, fail } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { generateId } from 'lucia';
import { setFlash } from 'sveltekit-flash-message/server';
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	const events = await prisma.club_event.findMany({
		where: {
			club_id: data.club.id,
			date: {
				gte: dayjs().add(-1, 'day').toDate()
			}
		},
		orderBy: [{ date: 'asc' }]
	});

	return {
		...data,
		events
	};
};

const getRecurringEvent = (
	club_id: number,
	event: Infer<NewClubEventSchema>
): Array<Prisma.club_eventCreateManyInput> => {
	if (!event.recurring) throw new Error('event is not recurring when it should be');
	const result: Array<Prisma.club_eventCreateManyInput> = [];
	let currentDate = dayjs(event.date);
	const finalDate = dayjs(event.end_date);

	const recurrence_id = generateId(32);

	// add initial event
	result.push({
		club_id: club_id,
		date: currentDate.toDate(),
		name: event.name,
		description: event.description,
		recurrence_id
	});

	while (currentDate.isBefore(finalDate) || currentDate.isSame(finalDate, 'day')) {
		switch (event.frequency) {
			case RecurrenceFrequency.DAILY:
				currentDate = currentDate.add(1, 'day');
				break;
			case RecurrenceFrequency.WEEKLY:
				currentDate = currentDate.add(1, 'week');
				break;
			case RecurrenceFrequency.BIWEEKLY:
				currentDate = currentDate.add(2, 'week');
				break;
			case RecurrenceFrequency.MONTHLY:
				currentDate = currentDate.add(1, 'month');
				break;
			default:
				throw new Error(
					'Invalid interval specified. Use "daily", "weekly", "biweekly", or "monthly".'
				);
		}

		result.push({
			club_id: club_id,
			date: currentDate.toDate(),
			name: event.name,
			description: event.description,
			recurrence_id
		});
	}
	return result;
};

export const actions: Actions = {
	CreateClubEvent: async (event) => {
		const { request, params } = event;
		const form = await superValidate(request, zod(new_club_event_schema));
		let t: ToastSettings;
		let new_club_event: club_event;
		if (!form.valid) {
			t = {
				message: 'Failed to create club event',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		try {
			new_club_event = await prisma.$transaction(async (db) => {
				let new_club;
				if (form.data.recurring) {
					const clubs = await db.club_event.createManyAndReturn({
						data: getRecurringEvent(Number(params.club_id), form.data)
					});
					new_club = clubs.at(0)!;
				} else {
					new_club = await db.club_event.create({
						data: {
							club_id: Number(params.club_id),
							date: form.data.date,
							name: form.data.name,
							description: form.data.description
						}
					});
				}
				return new_club;
			});

			t = {
				message: `Successfully Created New Event`,
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to create club event',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	}
};
