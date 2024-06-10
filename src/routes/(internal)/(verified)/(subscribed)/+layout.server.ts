import { UserRole } from '@prisma/client';
import type { LayoutServerLoad } from '../$types';
// import { UserRole } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = async (event) => {
  const { parent } = event;
  const data = await parent();
  const user_role: UserRole = data.user!.role as unknown as UserRole;
  if (user_role == UserRole.BASE) {
    const t: ToastSettings = {
      message: `You must be a subscriber to view this page`,
      background: 'variant-filled-warning'
    } as const;
    redirect('/pricing', t, event.cookies);
  }

  return data;
};
