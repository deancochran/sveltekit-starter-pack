import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { forgot_pass_schema, reset_forgot_pass_schema, signin_schema } from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { sendForgottenPasswordResetLink } from '$lib/utils/emails';
import { fail } from '@sveltejs/kit';
import { validatePasswordResetToken } from '$lib/utils/token';
import { lucia } from '$lib/server/lucia';
import type { User } from 'lucia';

export const load: PageServerLoad = async () => {
	const forgotPassForm = await superValidate(zod(signin_schema));
	const resetForgotPassForm = await superValidate(zod(reset_forgot_pass_schema));
	return { forgotPassForm, resetForgotPassForm };
};

export const actions: Actions = {
	forgot: async (event) => {
		const { url, request } = event;
		const form = await superValidate(request, zod(forgot_pass_schema));
		let t: ToastSettings;
		try {
			const user = await prisma.user.findUniqueOrThrow({ where: { email: form.data.email } });
			if (user) {
				await sendForgottenPasswordResetLink(user as unknown as User, url.origin);
			}
			t = {
				message: `A New Password Reset Link was Sent`,
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
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
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	reset_forgot: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, zod(reset_forgot_pass_schema));
		let t: ToastSettings;
		if (form.valid) {
			try {
				const user = await validatePasswordResetToken(form.data.code, form.data.password);

				if (!user.email_verified) {
					await prisma.user;
					t = {
						message: 'Your Email has Successfully been Verified',
						background: 'variant-filled-success'
					} as const;
					setFlash(t, event);
				}
				await lucia.invalidateUserSessions(user.id);
				const session = await lucia.createSession(user.id, {
					ip_country: locals.session?.ip_country
				});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});

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
			redirect('/', t, event);
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
