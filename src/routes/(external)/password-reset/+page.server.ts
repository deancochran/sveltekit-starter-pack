// routes/signup/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { sendPasswordResetLink } from '$lib/utils/email';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/sign-in');
	return {user:session.user};
};

export const actions: Actions = {
	resend: async ({ url, locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/sign-in');
		try {
			const user = await prisma.user.findUniqueOrThrow({ where: { email: session.user.email } });
			await sendPasswordResetLink(user, url.origin);
		} catch (e) {
			return fail(500, { message: 'server error' });
		}
	}
};