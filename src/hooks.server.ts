import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get(auth.sessionCookieName);
	if (!session_id) {
		event.locals.user = undefined;
		event.locals.session = undefined;
	} else {
		const { session, user } = await auth.validateSession(session_id);
		if (session && session.fresh) {
			const sessionCookie = auth.createSessionCookie(session.id);
			// sveltekit types deviates from the de-facto standard
			// you can use 'as any' too
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}
		if (!session) {
			const sessionCookie = auth.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}
		event.locals.user = user ?? undefined;
		event.locals.session = session ?? undefined;
	}

	let theme = '';

	const cookieTheme = event.cookies.get('theme');

	if (cookieTheme) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'skeleton', { path: '/' });
		theme = 'skeleton';
	}
	console.log(`${event.locals.user?.email ?? 'alien'} at ${event.route.id}`);

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
};
