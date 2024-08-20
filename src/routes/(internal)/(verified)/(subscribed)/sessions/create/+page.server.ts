import { IntervalSchema, training_session_schema } from '$lib/schemas';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { trainingSession } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type Actions, redirect as r } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const trainingSessionSchema = await superValidate(
		{
			title:
				new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()) + ' ' + 'Workout'
		},
		zod(training_session_schema)
	);
	const workoutIntervalSchema = await superValidate(zod(IntervalSchema));

	return { trainingSessionSchema, workoutIntervalSchema, ...data };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(training_session_schema));
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		if (form.data.plan.length === 0) {
			t = {
				message: 'No Intervals Were Found',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
		let created_session: trainingSession;
		try {
			if (!form.valid) throw new Error('Must provide a valid form');

			created_session = await prisma.trainingSession.create({
				data: {
					...form.data,
					user_id: locals.user.id
				}
			});
			t = {
				message: 'Successfully Created Your Training Session',
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			console.log(e);
			t = {
				message: 'Failed to create session',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		redirect(`/sessions/${created_session.id}`, t, event);
	}
};
