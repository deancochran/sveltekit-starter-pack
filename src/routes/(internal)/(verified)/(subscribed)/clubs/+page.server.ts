
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { PageServerLoad } from './$types';

import { redirect as r, type Actions } from '@sveltejs/kit';
export const load: PageServerLoad = async (event) => {
  const { parent } = event;
  const data = await parent();

  if (!data.user) r(302, handleSignInRedirect(event));
  const user_memberships = await prisma.club_member.findMany({
    where: {
      user_id: data.user?.id
    },
    include: {
      club: true
    }
  })
  const clubs = await prisma.club.findMany({ take: 5, include: { _count: { select: { members: true } } } },)
  const clubs_count = await prisma.club.count()

  return {
    ...data, user_memberships, clubs, clubs_count
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
