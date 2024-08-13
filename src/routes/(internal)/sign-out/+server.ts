import { redirect } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import type { RequestHandler } from '@sveltejs/kit';
import { lucia } from '$lib/server/lucia';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.session) {
		const t: ToastSettings = {
			message: `User must exist to sign-out`,
			background: 'variant-filled-warning'
		} as const;
		redirect('/sign-in', t, event);
	}
	await lucia.invalidateSession(event.locals.session.id);
	const sessionCookie = lucia.createBlankSessionCookie();
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});
	const t: ToastSettings = {
		message: `Goodbye ${event.locals.user?.username}`,
		background: 'variant-filled-success'
	} as const;
	redirect('/sign-in', t, event);
};
