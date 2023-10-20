import { auth } from '$lib/server/lucia';
import { validatePasswordResetToken } from '$lib/utils/token';
import { superValidate } from 'sveltekit-superforms/server';
import { reset_pass_schema } from '$lib/forms/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const resetPassForm = await superValidate(reset_pass_schema);
	return { resetPassForm };
};

export const actions: Actions = {
	reset: async (event) => {
		const { request, locals, params } = event;
		const form = await superValidate(request, reset_pass_schema);
		let t: ToastSettings;
		let valid;
		if (form.valid) {
			try {
				const token: string = String(params.token);
				const userId = await validatePasswordResetToken(token);
				let user = await auth.getUser(userId);
				await auth.invalidateAllUserSessions(user.userId);
				await auth.updateKeyPassword('email', user.email, form.data.password);
				if (!user.email_verified) {
					user = await auth.updateUserAttributes(user.userId, {
						email_verified: true
					});
					t = {
						message: 'Your Email has Successfully been Verified',
						background: 'variant-filled-success'
					} as const;
					setFlash(t, event);
				}
				const session = await auth.createSession({
					userId: user.userId,
					attributes: {}
				});
				locals.auth.setSession(session); // set session cookie
				t = {
					message: `Your Password has been Updated`,
					background: 'variant-filled-success'
				} as const;
				valid = true;
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
				valid = false;
			}
			if (valid) throw redirect('/', t, event);
			else throw redirect('/password-reset', t, event);
		} else {
			const t: ToastSettings = {
				message: 'Invalid Form',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
	}
};
