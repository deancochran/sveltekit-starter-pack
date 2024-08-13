import { checkConsentCookie, setConsentCookie } from '$lib/cookies';
import { lucia } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get(lucia.sessionCookieName);
	if (!session_id) {
		event.locals.user = undefined;
		event.locals.session = undefined;
		event.locals.consent_cookie = checkConsentCookie(event);
	} else {
		const { session, user } = await lucia.validateSession(session_id);
		// Assuming they have accepted to the terms and conditions of the app, then they would've accepted the privacy policy
		if (session && session.fresh) {
			setConsentCookie(event);
			const sessionCookie = lucia.createSessionCookie(session.id);
			if (event.locals.consent_cookie) {
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '/',
					...sessionCookie.attributes
				});
			}
		}
		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes
			});
		}
		event.locals.user = user ?? undefined;
		event.locals.session = session ?? undefined;
		event.locals.consent_cookie = checkConsentCookie(event);
	}
	const cookieTheme = event.cookies.get('theme');
	const theme = cookieTheme ?? 'skeleton';

	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
};
