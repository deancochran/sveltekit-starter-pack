import type { LayoutServerLoad } from './$types';
import { flashCookieOptions, loadFlash } from 'sveltekit-flash-message/server';
flashCookieOptions.sameSite = 'lax';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { locals, url } = event;
	return {
		user: locals.user,
		session: locals.session,
		pathname: url.pathname
	};
});