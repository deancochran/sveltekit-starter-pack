import { training_session_schema, workout_interval_schema } from '$lib/schemas';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { trainingSession } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type Actions, redirect as r } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const trainingSessionSchema = await superValidate(zod(training_session_schema));
	const workoutIntervalSchema = await superValidate(zod(workout_interval_schema));

	return { trainingSessionSchema, workoutIntervalSchema, ...data };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(training_session_schema));
		form.data.training_plan_id = Number(params.plan_id);
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		console.log(form.data);
		if (form.data.plan.length === 0) {
			t = {
				message: 'No Intervals Were Found',
				background: 'variant-filled-warning'
			} as const;
			redirect(`/plans/${params.plan_id}/sessions/create`, t, event);
		}
		let created_session: trainingSession;
		try {
			if (!form.valid) throw new Error('Must provide a valid form');

			created_session = await prisma.trainingSession.create({
				data: {
					...form.data
				}
			});
			t = {
				message: 'Successfully Created Your Training Session',
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			t = {
				message: 'Failed to create session',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		redirect(`/plans/${created_session.training_plan_id}/sessions/${created_session.id}`, t, event);
	}
};
