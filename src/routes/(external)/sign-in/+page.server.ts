// routes/signup/+page.server.ts
import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.email_verified) throw redirect(302, '/verify-email');
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	signin: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = String(formData.get('email'));
		const password = String(formData.get('password'));
		let session;

		try {
			const key = await auth.useKey('email', email, password);
			session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			return fail(500, {
				message: 'An unknown error occurred'
			});
		}
		if (session) {
			if (session.user.email_verified) {
				throw redirect(302, '/');
			} else {
				throw redirect(302, '/verify-email');
			}
		}
	}
};
