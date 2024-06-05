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
      return { form };
    } catch (e) {
      console.log(e);
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
    if (!Number(params.session_id)) return fail(400);
    if (!locals.user) redirect(302, handleSignInRedirect(event));
    const form = await superValidate(request, zod(create_wahoo_workout_schema));
    if (!form.valid) {
      return fail(400, { form });
    }
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
      const plan = convertTrainingSessionToWahooPlan(locals.user, training_session);
      const body: WahooV1PlanRequestBody = {
        plan: {
          file: `data:application/json;base64,${btoa(JSON.stringify(plan, null, 2))}`,
          filename: 'plan.json',
          external_id: form.data.workout_token,
          provider_updated_at: new Date().toISOString()
        }
      };
      const wahoo_plan = await wahoo_user.createPlan(body);
      await wahoo_user.createWorkout({ workout: { ...form.data, plan_id: wahoo_plan.id } });
    } catch (error) {
      console.log(error)
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
