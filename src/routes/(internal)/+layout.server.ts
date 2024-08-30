import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	if (!data.user) {
		redirect(302, handleSignInRedirect(event));
	}

	return data;
};
