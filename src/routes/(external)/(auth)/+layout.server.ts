import type { LayoutServerLoad } from './$types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (data.session) {
		if (!data.user?.email_verified) {
			redirect('/verify-email', event);
		} else {
			redirect('/', event);
		}
	}

	if (!data.consent_cookie) {
		const t: ToastSettings = {
			message: `Accept the Cookie Policy to Continue`,
			background: 'variant-filled-warning'
		} as const;
		redirect('/', t, event);
	}
	return data;
};
