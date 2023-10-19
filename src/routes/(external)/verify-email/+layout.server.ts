import type { LayoutServerLoad } from './$types';
import { redirect } from 'sveltekit-flash-message/server';


export const load: LayoutServerLoad = async (event) => {
	const { locals, parent } = event;
    await parent();
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/sign-in');
	if (session.user.email_verified) { throw redirect(302, '/') }
	return { user: session.user };
};
