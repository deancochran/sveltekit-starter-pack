import { LuciaError } from 'lucia';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ parent }) => {
	return await parent();
};

export const actions: Actions = {
	updateUser: async (event) => {
		try {
			await auth.updateUserAttributes(
				event.locals.session.user.userId,
				{
					username: 'NewUserName'
				} // expects partial `Lucia.DatabaseUserAttributes`
			);
			await auth.invalidateAllUserSessions(event.locals.session.user.userId); // invalidate all user sessions => logout all sessions
			const session = await auth.createSession({
				userId: event.locals.session.user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
				// invalid user id
			}
		}
	},
	deleteUser: async (event) => {
		try {
			await auth.deleteUser(event.locals.session.user.userId);
		} catch (e) {
			if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
				// invalid user id
			}
		}
	}
};
