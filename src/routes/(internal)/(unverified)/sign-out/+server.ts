import { redirect } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import type { RequestHandler } from '@sveltejs/kit';
import type { Session } from 'lucia';

export const GET: RequestHandler = async (event) => {
	const { locals } = event;
	const session: Session = await locals.auth.validate();
	if (!session) {
		const t: ToastSettings = {
			message: `User must exist to sign-out`,
			background: 'variant-filled-warning'
		} as const;
		throw redirect('/sign-in', t, event); // redirect to sign-in page
	}
	await locals.auth.invalidate();
	locals.auth.setSession(null); // remove cookie
	const t: ToastSettings = {
		message: `Goodbye ${session.user.username}`,
		background: 'variant-filled-success'
	} as const;
	throw redirect('/sign-in', t, event); // redirect to sign-in page
};
