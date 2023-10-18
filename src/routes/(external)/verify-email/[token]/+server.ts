import { validateEmailVerificationToken } from '$lib/utils/token';
import { auth } from '$lib/server/lucia';

import type { RequestHandler } from "./$types";
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	const { token } = params;
	try {
		const userId = await validateEmailVerificationToken(token);
		const user = await auth.getUser(userId);
		await auth.invalidateAllUserSessions(user.userId);
		await auth.updateUserAttributes(user.userId, {
			email_verified: true // `Number(true)` if stored as an integer
		});
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);
	} catch {
		return new Response("Invalid email verification link", {
			status: 400
		});

	}
	throw redirect(302,'/')
};
