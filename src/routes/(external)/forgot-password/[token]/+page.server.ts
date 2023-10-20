import { auth } from '$lib/server/lucia';
import { validatePasswordResetToken } from '$lib/utils/token';
import { superValidate } from 'sveltekit-superforms/server';
import { reset_forgot_pass_schema } from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const resetForgotPassForm = await superValidate(reset_forgot_pass_schema);
	return { resetForgotPassForm };
};

export const actions: Actions = {
	reset_forgot: async (event) => {
		const { request, locals, params } = event;
		const form = await superValidate(request, reset_forgot_pass_schema);
		let t: ToastSettings;
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
			}
			throw redirect('/', t, event);
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
