import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect as r } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
export const load: LayoutServerLoad = async (event) => {
  const { parent, params } = event;
  const data = await parent();

  if (!data.user) r(302, handleSignInRedirect(event));
  if (!Number(params.club_id)) {
    const t: ToastSettings = {
      message: 'Failed to find club',
      background: 'variant-filled-error'
    } as const;
    redirect(`/clubs`, t, event);
  }
  const club = await prisma.club.findFirst({
    where: {
      id: Number(params.club_id)
    },
    include: {
      _count: {
        select: {
          members: true
        }
      }
    }
  });
  if (!club) {
    const t: ToastSettings = {
      message: 'Failed to find session',
      background: 'variant-filled-error'
    } as const;
    redirect(`/sessions`, t, event);
  }

  return {
    ...data, club
  };
};
