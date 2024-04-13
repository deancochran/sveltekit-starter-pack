import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { training_plan_schema } from '$lib/schemas';
// import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
// import type { trainingPlan } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { trainingPlan } from '@prisma/client';
import { fail } from 'sveltekit-superforms';
import { redirect as r } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const trainingPlanSchema = await superValidate(zod(training_plan_schema));
	return { trainingPlanSchema, ...data };
};

export const actions: Actions = {
	create: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(training_plan_schema));
		if (!locals.user) r(302, handleSignInRedirect(event));
		let created_plan: trainingPlan;
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid form');
			created_plan = await prisma.trainingPlan.create({
				data: {
					...form.data,
					user_id: locals.user.id
				}
			});
			t = {
				message: 'Successfully Created Your Training Plan',
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			t = {
				message: 'Failed to create plan',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		redirect(`/plans/${created_plan.id}`, t, event);
	}
};
