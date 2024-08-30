import { db } from '$lib/drizzle/client';
import {
	thirdPartyIntegrationToken,
	trainingSession
} from '$lib/drizzle/schema';
import { createWahooWorkoutSchema, trainingSessionSchema } from '$lib/schemas';
import { WahooAPI } from '$lib/integrations/wahoo/api';
import type {
	WahooCreateWorkoutRequestBody,
	WahooV1PlanRequestBody
} from '$lib/integrations/wahoo/types';
import { convertTrainingSessionToWahooPlan } from '$lib/integrations/wahoo/utils';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type Actions, redirect as r } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const actions: Actions = {
	update: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(trainingSessionSchema));
		if (!Number(params.sessionId)) return fail(400, { form });
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid form');

			await db
				.update(trainingSession)
				.set({
					...form.data
				})
				.where(eq(trainingSession.id, Number(params.sessionId)));
			t = {
				message: 'Successfully Updated Training Session',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
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
		if (!Number(params.sessionId)) return fail(400);
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		try {
			await db
				.delete(trainingSession)
				.where(eq(trainingSession.id, Number(params.sessionId)));
		} catch (e) {
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
		redirect('/sessions', t, event);
	},
	CreateWahooWorkout: async (event) => {
		const { locals, request, params } = event;
		if (!Number(params.sessionId)) return fail(400);
		if (!locals.user) redirect(302, handleSignInRedirect(event));
		const form = await superValidate(request, zod(createWahooWorkoutSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		let t: ToastSettings;
		try {
			const integration = await db.query.thirdPartyIntegrationToken.findFirst({
				where: and(
					eq(thirdPartyIntegrationToken.provider, 'WAHOO'),
					eq(thirdPartyIntegrationToken.userId, locals.user.id)
				)
			});
			if (!integration) throw new Error('No integration found');
			const _trainingSession = await db.query.trainingSession.findFirst({
				where: eq(trainingSession.id, Number(params.sessionId))
			});
			if (!_trainingSession) throw new Error('No Session Found');

			const wahooUser = new WahooAPI(integration);
			const plan = convertTrainingSessionToWahooPlan(
				locals.user,
				_trainingSession
			);
			const body: WahooV1PlanRequestBody = {
				plan: {
					file: `data:application/json;base64,${btoa(JSON.stringify(plan, null, 2))}`,
					filename: 'plan.json',
					external_id: form.data.workoutToken,
					provider_updated_at: new Date().toISOString()
				}
			};
			const wahooPlan = await wahooUser.createPlan(body);
			const wahooUserNewWorkoutBody: WahooCreateWorkoutRequestBody = {
				workout: {
					name: form.data.name,
					workout_type_id: form.data.workout_type_id,
					starts: form.data.starts,
					minutes: form.data.minutes,
					workout_token: form.data.workoutToken,
					plan_id: wahooPlan.id,
					workout_summary_id: form.data.workoutSummaryId
				}
			};
			await wahooUser.createWorkout(wahooUserNewWorkoutBody);
		} catch (error) {
			t = {
				message: 'Failed to Create Scheduled Wahoo Workout',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
		t = {
			message: 'Successfully Created Scheduled Wahoo Workout',
			background: 'variant-filled-success'
		} as const;
		setFlash(t, event);
		return { form };
	}
};
