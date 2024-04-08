import { training_session_schema } from "$lib/schemas";
import { handleSignInRedirect } from "$lib/utils/redirects/loginRedirect";
import type { trainingPlan } from "@prisma/client";
import type { ToastSettings } from "@skeletonlabs/skeleton";
import { type Actions, redirect as r } from "@sveltejs/kit";
import { redirect, setFlash } from "sveltekit-flash-message/server";
import { superValidate, fail } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const trainingSessionSchema = await superValidate(zod(training_session_schema));
	return { trainingSessionSchema, ...data };
};


export const actions: Actions = {
	create: async (event) => {
		const { locals, request } = event;
		
		const form = await superValidate(request, zod(training_session_schema));
		if (!locals.user) r(302, handleSignInRedirect(event));
		// let t: ToastSettings;
		// try {
		// 	if (!form.valid) throw new Error('Must provide a valid form');
		// 	created_session = await prisma.trainingSession.create({
		// 		data: {
		// 			...form.data,
		// 		}
		// 	});
		// 	t = {
		// 		message: 'Successfully Created Your Training Plan',
		// 		background: 'variant-filled-success'
		// 	} as const;
		// } catch (e) {
		// 	t = {
		// 		message: 'Failed to delete account',
		// 		background: 'variant-filled-error'
		// 	} as const;
		// 	setFlash(t, event);
		// 	return fail(400, { form });
		// }
		// redirect(`/plans/${created_plan.id}`, t, event);
	}
};

