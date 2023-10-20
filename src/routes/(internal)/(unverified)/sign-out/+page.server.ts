import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ locals, parent }) => {
	const data = await parent();
	await auth.invalidateSession(data.session.sessionId); // invalidate session
	locals.auth.setSession(null); // remove cookie
	throw redirect(302, '/sign-in'); // redirect to sign-in page
};
