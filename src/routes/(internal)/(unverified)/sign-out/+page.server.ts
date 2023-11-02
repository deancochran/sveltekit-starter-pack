import { redirect } from 'sveltekit-flash-message/server';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
export const load: PageServerLoad = async (event) => {
	const { locals, parent } = event;
	const data = await parent();
	await auth.invalidateSession(data.session.sessionId); // invalidate session
	locals.auth.setSession(null); // remove cookie
	const t: ToastSettings = {
		message: `Goodbye ${data.session.user.username}`,
		background: 'variant-filled-success'
	} as const;
	throw redirect('/sign-in', t, event); // redirect to sign-in page
};
