import type { LayoutServerLoad } from '../$types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	let t: ToastSettings = {
		message: 'Your Email has Successfully been Verified',
		background: 'variant-filled-success'
	} as const;
	if (data.user?.email_verified == true) redirect(`/`, t, event);
	return data;
};
