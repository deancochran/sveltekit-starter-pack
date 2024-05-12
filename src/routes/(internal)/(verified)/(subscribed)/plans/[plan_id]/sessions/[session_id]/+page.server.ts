import {
	create_wahoo_workout_schema,
	training_session_schema,
	IntervalSchema,
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
import { ThirdPartyIntegrationProvider } from '@prisma/client';
import type { WahooV1PlanRequestBody } from '$lib/utils/integrations/wahoo/types';
import { WahooAPI } from '$lib/utils/integrations/wahoo/api';
import { convertTrainingSessionToWahooPlan } from '$lib/utils/integrations/wahoo/utils';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const training_session_form = await superValidate(
		data.training_session as Partial<TrainingSessionSchema>,
		zod(training_session_schema)
	);
	const workout_interval_form = await superValidate(zod(IntervalSchema));
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

			const updated_training_session = await prisma.trainingSession.update({
				where: {
					id: Number(params.session_id)
				},
				data: {
					...form.data
				},
				include: {
					third_party_training_sessions: true
				}
			});
			if (updated_training_session.third_party_training_sessions.length > 0) {
				// get user integrations
				const integrations = await prisma.thirdPartyIntegrationToken.findMany({
					where: {
						user_id: locals.user.id
					}
				});
				// Update third_party_training_sessions
				for (const third_party_training_session of updated_training_session.third_party_training_sessions) {
					switch (third_party_training_session.provider) {
						case ThirdPartyIntegrationProvider.WAHOO: {
							// Get user wahoo integration
							const wahoo_integration = integrations.find(
								(integration) => integration.provider === ThirdPartyIntegrationProvider.WAHOO
							);
							if (!wahoo_integration) break;
							// Update Wahoo
							const wahoo_api = new WahooAPI(wahoo_integration);
							const new_wahoo_plan = convertTrainingSessionToWahooPlan(
								locals.user,
								updated_training_session
							);
							const body: WahooV1PlanRequestBody = {
								plan: {
									file: `data:application/json;base64,${btoa(JSON.stringify(new_wahoo_plan, null, 2))}`,
									filename: 'plan.json',
									provider_updated_at: new Date().toISOString()
								}
							};
							await wahoo_api.updatePlan(
								third_party_training_session.provider_training_session_id,
								body
							);
							break;
						}

						default:
							break;
					}
				}
			}
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
		if (!Number(params.plan_id)) return fail(400);
		if (!Number(params.session_id)) return fail(400);
		if (!locals.user) r(302, handleSignInRedirect(event));
		let t: ToastSettings;
		try {
			const deleted_training_session = await prisma.trainingSession.delete({
				where: {
					id: Number(params.session_id)
				},
				include: {
					third_party_training_sessions: true
				}
			});
			if (deleted_training_session.third_party_training_sessions.length > 0) {
				// get user integrations
				const integrations = await prisma.thirdPartyIntegrationToken.findMany({
					where: {
						user_id: locals.user.id
					}
				});
				// Update third_party_training_sessions
				for (const third_party_training_session of deleted_training_session.third_party_training_sessions) {
					switch (third_party_training_session.provider) {
						case ThirdPartyIntegrationProvider.WAHOO: {
							// Get user wahoo integration
							const wahoo_integration = integrations.find(
								(integration) => integration.provider === ThirdPartyIntegrationProvider.WAHOO
							);
							if (!wahoo_integration) break;
							// Update Wahoo
							const wahoo_api = new WahooAPI(wahoo_integration);
							await wahoo_api.deletePlan(third_party_training_session.provider_training_session_id);
							break;
						}

						default:
							break;
					}
				}
			}
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
		redirect('/plans/' + params.plan_id + '/sessions', t, event);
	},
	CreateWahooWorkout: async (event) => {
		const { locals, request, params } = event;
		if (!Number(params.plan_id)) return fail(400);
		if (!Number(params.session_id)) return fail(400);
		if (!locals.user) redirect(302, handleSignInRedirect(event));
		const form = await superValidate(request, zod(create_wahoo_workout_schema));
		if (!form.valid) fail(400, { form });
		let t: ToastSettings;
		try {
			const wahoo_integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
				where: {
					user_id: locals.user.id,
					provider: ThirdPartyIntegrationProvider.WAHOO
				}
			});
			const training_session = await prisma.trainingSession.findFirstOrThrow({
				where: {
					id: Number(params.session_id)
				}
			});
			const wahoo_user = new WahooAPI(wahoo_integration);

			if (!form.data.plan_id) {
				const plan = convertTrainingSessionToWahooPlan(locals.user, training_session);
				const body: WahooV1PlanRequestBody = {
					plan: {
						file: `data:application/json;base64,${btoa(JSON.stringify(plan, null, 2))}`,
						filename: 'plan.json',
						external_id: training_session.uuid,
						provider_updated_at: new Date().toISOString()
					}
				};
				await prisma.$transaction(async (db) => {
					const wahoo_plan = await wahoo_user.createPlan(body);
					await db.thirdPartyIntegrationTrainingSession.create({
						data: {
							provider: ThirdPartyIntegrationProvider.WAHOO,
							training_session_id: training_session.id,
							provider_training_session_id: wahoo_plan.id,
							meta: wahoo_plan
						}
					});

					await wahoo_user.createWorkout({ workout: form.data });
				});
			} else {
				await wahoo_user.createWorkout({ workout: form.data });
			}
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
