import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (!data.session) redirect(302, handleSignInRedirect(event));

	return data;
};
