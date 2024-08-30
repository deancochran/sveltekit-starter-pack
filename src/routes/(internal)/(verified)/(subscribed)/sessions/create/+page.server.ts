import { db } from '$lib/drizzle/client';
import { trainingSession } from '$lib/drizzle/schema';
import { trainingSessionSchema } from '$lib/schemas';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type Actions, redirect as r } from '@sveltejs/kit';
import type { InferInsertModel } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const newTrainingSessionForm = await superValidate(
		{
			title:
				new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
					new Date()
				) +
				' ' +
				'Workout'
		},
		zod(trainingSessionSchema)
	);

	return { newTrainingSessionForm, ...data };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(trainingSessionSchema));
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		if (form.data.plan.length === 0) {
			t = {
				message: 'No Intervals Were Found',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
		let newSession: InferInsertModel<typeof trainingSession>;
		try {
			if (!form.valid) throw new Error('Must provide a valid form');

			[newSession] = await db
				.insert(trainingSession)
				.values({
					...form.data,
					activityType: form.data.activityType,
					stressScore: form.data.stressScore,
					userId: locals.user.id
				})
				.returning();
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
		redirect(`/sessions/${newSession.id}`, t, event);
	}
};
