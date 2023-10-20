import type { LayoutServerLoad } from './$types';

import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(async (event) => {
	const { parent, locals } = event;
	await parent();
	return { session: await locals.auth.validate() };
});
