import {
	training_session_schema,
	workout_interval_schema,
	type TrainingSessionSchema
} from '$lib/schemas';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { redirect as r, type Actions } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const training_session_form = await superValidate(
		data.training_session as Partial<TrainingSessionSchema>,
		zod(training_session_schema)
	);
	const workout_interval_form = await superValidate(zod(workout_interval_schema));
	return {
		training_session_form,
		workout_interval_form,
		...data
	};
};

export const actions: Actions = {
	update: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(training_session_schema));
		if (!Number(params.plan_id)) return fail(400, { form });
		if (!Number(params.session_id)) return fail(400, { form });
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid form');
			await prisma.trainingSession.update({
				where: {
					id: Number(params.session_id)
				},
				data: {
					...form.data
				}
			});
			t = {
				message: 'Successfully Updated Training Session',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
		} catch (e) {
			t = {
				message: 'Failed to update session',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	delete: async (event) => {
		const { locals, params } = event;
		if (!Number(params.plan_id)) return fail(400);
		if (!Number(params.session_id)) return fail(400);
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		try {
			await prisma.trainingSession.delete({
				where: {
					id: Number(params.session_id)
				}
			});
		} catch (e) {
			console.log(e);
			t = {
				message: 'Failed to delete session',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400);
		}
		t = {
			message: 'Successfully Deleted Training Session',
			background: 'variant-filled-success'
		} as const;
		redirect('/plans/' + params.plan_id + '/sessions', t, event);
	}
};
