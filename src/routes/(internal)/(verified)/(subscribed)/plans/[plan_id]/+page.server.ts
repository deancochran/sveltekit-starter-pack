import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { training_plan_schema } from '$lib/schemas';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (!data.user) redirect(302, handleSignInRedirect(event));
	// get all activities in the past week
	const training_plan_form = await superValidate({
        name: data.plan.name,
        description: data.plan.description,
        start_date: data.plan.start_date,
        end_date: data.plan.end_date 
    }, zod(training_plan_schema));
	return {
		training_plan_form,
		...data
	};
};

export const actions: Actions = {
	update: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(training_plan_schema));
        if (!Number(params.plan_id)) return fail(400, { form });
		if (!locals.user) redirect(302, handleSignInRedirect(event));
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid form');
			await prisma.trainingPlan.update({
				where: {
					id: Number(params.plan_id)
				},
				data: {
					...form.data
				}
			});
			t = {
				message: 'Successfully Updated Training Plan',
				background: 'variant-filled-success'
			} as const;
            setFlash(t, event);
		} catch (e) {
			t = {
				message: 'Failed to update plan',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
    delete: async (event) => {
        const { locals, params } = event;
        if (!Number(params.plan_id)) return fail(400);
		if (!locals.user) redirect(302, handleSignInRedirect(event));
        let t: ToastSettings;
        try {
            await prisma.trainingPlan.delete({
                where: {
                    id: Number(params.plan_id)
                }
            });
            t = {
                message: 'Successfully Deleted Training Plan',
                background: 'variant-filled-success'
            } as const;
            redirect('/plans',t, event);
            
        } catch (e) {
            t = {
                message: 'Failed to delete plan',
                background: 'variant-filled-error'
            } as const;
            setFlash(t, event);
            return fail(400);
        }
    }
};
