import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';
import { loadFlash, flashCookieOptions } from 'sveltekit-flash-message/server';
flashCookieOptions.domain = process.env.PUBLIC_DOMAIN;
flashCookieOptions.sameSite = 'lax';
flashCookieOptions.secure = !dev;

export const load: LayoutServerLoad = loadFlash((event) => {
	const { locals, url } = event;
	
	return {
		user: locals.user,
		session: locals.session,
		pathname: url.pathname,
		consent_cookie: locals.consent_cookie
	};
});
