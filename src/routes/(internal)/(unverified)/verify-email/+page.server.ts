import { fail, type Actions } from '@sveltejs/kit';
import { resendEmailVerificationLink } from '$lib/utils/emails';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (data.session.user.email_verified) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	resend: async (event) => {
		const { url, locals } = event;
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/sign-in');
		let t: ToastSettings;
		try {
			const user = await prisma.user.findUniqueOrThrow({ where: { email: session.user.email } });
			await resendEmailVerificationLink(user, url.origin);
			t = {
				message: `New Email Verification Link Sent ${session.user.username}`,
				background: 'variant-filled-success'
			} as const;
		} catch (error) {
			let message;
			if (error instanceof Error) {
				message = error.message;
			} else {
				message = String(error);
			}
			t = {
				message: message,
				background: 'variant-filled-warning'
			} as const;
			return fail(500);
		}
		setFlash(t, event);
	}
};
