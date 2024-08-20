import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent, locals } = event;
	const data = await parent();
	if (locals.session) {
		if (!data.user?.email_verified) {
			redirect('/verify-email', event);
		} else {
			redirect('/', event);
		}
	}

	if (!locals.consent_cookie) {
		const t: ToastSettings = {
			message: `Accept the Cookie Policy to Continue`,
			background: 'variant-filled-warning'
		} as const;
		redirect('/', t, event);
	}
	return data;
};
