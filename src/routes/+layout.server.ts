import { HOST } from '$env/static/private';
import { flashCookieOptions, loadFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
flashCookieOptions.domain = HOST;
flashCookieOptions.path = '.';
flashCookieOptions.sameSite = 'strict';
flashCookieOptions.secure = true;

export const load: LayoutServerLoad = loadFlash((event) => {
	const { locals, url } = event;

	return {
		user: locals.user,
		pathname: url.pathname,
		consent_cookie: locals.consent_cookie
	};
});
