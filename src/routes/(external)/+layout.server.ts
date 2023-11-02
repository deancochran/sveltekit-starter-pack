import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (data.session) {
		if (!data.session.user.email_verified) throw redirect(302, '/verify-email');
		throw redirect(302, '/');
	}

	return data;
};
