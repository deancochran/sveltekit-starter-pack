import { auth } from '$lib/server/lucia';
import { validatePasswordResetToken } from '$lib/utils/token';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/sign-in');
	return { user: session.user };
};

export const actions: Actions = {
	reset: async ({ locals, request, params }) => {
		const formData = await request.formData();
		const password = String(formData.get('password'));
		const val_password = String(formData.get('val_password'));
		if (password != val_password) {
			console.log('Invalid Passwords or Token', password, val_password);
			return fail(500, { message: 'Invalid Passwords or Token' });
		}
		try {
			const { token } = params;
			const userId = await validatePasswordResetToken(token);
			let user = await auth.getUser(userId);
			await auth.invalidateAllUserSessions(user.userId);
			await auth.updateKeyPassword('email', user.email, password);

			if (!user.email_verified) {
				user = await auth.updateUserAttributes(user.userId, {
					email_verified: true
				});
			}
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			console.log(e);
			return fail(500, { message: 'Invalid Passwords or Token' });
		}
		throw redirect(302, '/');
	}
};
