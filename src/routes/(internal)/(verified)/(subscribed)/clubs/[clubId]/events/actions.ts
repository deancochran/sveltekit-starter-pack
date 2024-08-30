import { db } from '$lib/drizzle/client';
import { clubEvent } from '$lib/drizzle/schema';
import {
	newClubEventSchema,
	RecurrenceFrequency,
	type NewClubEventSchema
} from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail, type Actions } from '@sveltejs/kit';
import dayjs from 'dayjs';
import type { InferInsertModel } from 'drizzle-orm';
import { generateId } from 'lucia';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate, type Infer } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
type NewEvent = typeof clubEvent.$inferInsert;

export const getRecurringEvent = (
	clubId: number,
	event: Infer<NewClubEventSchema>
): Array<InferInsertModel<typeof clubEvent>> => {
	if (!event.recurring)
		throw new Error('event is not recurring when it should be');
	const result: Array<InferInsertModel<typeof clubEvent>> = [];
	let currentDate = dayjs(event.date);
	const finalDate = dayjs(event.endDate);

	const recurrenceId = generateId(32);

	// add initial event
	result.push({
		clubId: clubId,
		date: currentDate.toDate(),
		name: event.name,
		description: event.description,
		recurrenceId: recurrenceId
	});

	while (
		currentDate.isBefore(finalDate) ||
		currentDate.isSame(finalDate, 'day')
	) {
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
			clubId: clubId,
			date: currentDate.toDate(),
			name: event.name,
			description: event.description,
			recurrenceId: recurrenceId
		});
	}
	return result;
};

export const actions: Actions = {
	CreateClubEvent: async (event) => {
		const { request, params } = event;
		const form = await superValidate(request, zod(newClubEventSchema));
		let t: ToastSettings;
		let newClubEvent: NewEvent;
		if (!form.valid) {
			t = {
				message: 'Failed to create club event',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		try {
			newClubEvent = await db.transaction(async (tx) => {
				let newClubEvent: NewEvent;
				if (form.data.recurring) {
					const newClubEvents = await tx
						.insert(clubEvent)
						.values([...getRecurringEvent(Number(params.club_ids), form.data)])
						.returning();
					newClubEvent = newClubEvents.at(0)!;
				} else {
					[newClubEvent] = await tx
						.insert(clubEvent)
						.values({
							clubId: Number(params.clubId),
							date: form.data.date,
							name: form.data.name,
							description: form.data.description
						})
						.returning();
				}
				return newClubEvent;
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
