import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, superValidate } from 'sveltekit-superforms';
import { new_club_event_schema } from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();
	if (!Number(params.event_id)) error(400, { message: 'Must provide an event id', code: '400' });
	const club_event = await prisma.club_event.findUniqueOrThrow({
		where: {
			id: Number(params.event_id),
			club_id: data.club.id
		},
		include: {
			training_session: true
		}
	});
	const user_integrations = await prisma.thirdPartyIntegrationToken.findMany({
		where: {
			user_id: data.user!.id
		}
	});

	const { training_session, ...everythingElse } = club_event;
	const update_club_event = everythingElse;
	const update_club_event_form = await superValidate(
		{
			...update_club_event,
			training_session_id: update_club_event.training_session_id ?? undefined
		},
		zod(new_club_event_schema)
	);

	return {
		...data,
		club_event,
		user_integrations,
		update_club_event_form
	};
};

export const actions: Actions = {
	UpdateClubEvent: async (event) => {
		const { request, params } = event;
		const form = await superValidate(request, zod(new_club_event_schema));
		let t: ToastSettings;
		try {
			console.log(form.data);
			await prisma.club_event.update({
				where: {
					id: Number(params.event_id)
				},
				data: {
					training_session_id: form.data.training_session_id,
					date: form.data.date,
					name: form.data.name,
					description: form.data.description
				}
			});

			t = {
				message: `Successfully Update Club Event`,
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			console.log(e);
			t = {
				message: `Failed to Update Club Event`,
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	}
};
