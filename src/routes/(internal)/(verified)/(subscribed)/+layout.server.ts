import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (!data.user) throw new Error('No User Error');
	if (data.user.role == 'BASE') {
		const t: ToastSettings = {
			message: `You must be a subscriber to view this page`,
			background: 'variant-filled-warning'
		} as const;
		redirect('/pricing', t, event.cookies);
	}

	return data;
};
