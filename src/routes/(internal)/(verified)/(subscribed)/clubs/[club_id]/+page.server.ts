
import { select } from 'd3';
import type { PageServerLoad } from './$types';

import { type Actions } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
  const { parent } = event;
  const data = await parent();

  const members = await prisma.club_member.findMany({
    where: {
      club_id: data.club.id
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
          role: true,
          avatar_file_id: true
        }
      },
    }
  })

  return {
    ...data, members
  };
};




export const actions: Actions = {
  create: async (event) => {
    const { locals, request, params } = event;
    // const form = await superValidate(request, zod(training_session_schema));
    // if (!locals.user) r(302, handleSignInRedirect(event));
    // let t: ToastSettings;
    // if (form.data.plan.length === 0) {
    // 	t = {
    // 		message: 'No Intervals Were Found',
    // 		background: 'variant-filled-warning'
    // 	} as const;
    // 	setFlash(t, event);
    // }
    // let created_session: trainingSession;
    // try {
    // 	if (!form.valid) throw new Error('Must provide a valid form');
    //
    // 	created_session = await prisma.trainingSession.create({
    // 		data: {
    // 			...form.data,
    // 			user_id: locals.user.id
    // 		}
    // 	});
    // 	t = {
    // 		message: 'Successfully Created Your Training Session',
    // 		background: 'variant-filled-success'
    // 	} as const;
    // } catch (e) {
    // 	console.log(e);
    // 	t = {
    // 		message: 'Failed to create session',
    // 		background: 'variant-filled-error'
    // 	} as const;
    // 	setFlash(t, event);
    // 	return fail(400, { form });
    // }
  }
};
