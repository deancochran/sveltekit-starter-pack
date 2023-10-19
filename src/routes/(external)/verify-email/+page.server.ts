import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { resendEmailVerificationLink } from '$lib/utils/email';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash, redirect } from 'sveltekit-flash-message/server';

export const actions: Actions = {
	resend: async (event) => {
		const { url, locals } = event;
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/sign-in');
		if (session.user.email_verified) {
			throw redirect(302, '/');
		}
		let t: ToastSettings
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
		setFlash(t, event)
	}
};
