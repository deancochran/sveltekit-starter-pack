import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	await parent()
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/sign-in');
	if (!session.user.email_verified) throw redirect(302, '/sign-in');
	
	return { user: session.user };
};
