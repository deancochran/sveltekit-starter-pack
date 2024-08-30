import { db } from '$lib/drizzle/client';
import { clubEvent, thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import { newClubEventSchema } from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { error, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();
	if (!data.user) throw new Error('No user found');
	if (!Number(params.eventId))
		error(400, { message: 'Must provide an event id', code: '400' });
	const _clubEvent = await db.query.clubEvent.findFirst({
		where: and(
			eq(clubEvent.id, Number(params.eventId)),
			eq(clubEvent.clubId, data.club.id)
		),
		with: {
			trainingSession: true
		}
	});
	if (!_clubEvent) throw new Error('no club event');

	const userIntegrations = await db.query.thirdPartyIntegrationToken.findMany({
		where: eq(thirdPartyIntegrationToken.userId, data.user.id)
	});

	const { trainingSession, ...everythingElse } = _clubEvent;
	const updateClubEvent = everythingElse;
	const updateClubEventForm = await superValidate(
		{
			...updateClubEvent,
			trainingSessionId: updateClubEvent.trainingSessionId ?? undefined
		},
		zod(newClubEventSchema)
	);

	return {
		...data,
		clubEvent: _clubEvent,
		userIntegrations,
		updateClubEventForm
	};
};

export const actions: Actions = {
	UpdateClubEvent: async (event) => {
		const { request, params } = event;
		if (!Number(params.event_id)) throw new Error('no event id found');
		const form = await superValidate(request, zod(newClubEventSchema));
		let t: ToastSettings;
		try {
			await db
				.update(clubEvent)
				.set({
					trainingSessionId: form.data.trainingSessionId,
					date: form.data.date,
					name: form.data.name,
					description: form.data.description
				})
				.where(eq(clubEvent.id, Number(params.event_id)));

			t = {
				message: `Successfully Update Club Event`,
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: `Failed to Update Club Event`,
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	}
};
