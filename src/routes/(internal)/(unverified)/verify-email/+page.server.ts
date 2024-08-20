import { verify_user_email_schema } from '$lib/schemas';
import { lucia } from '$lib/server/lucia';
import { sendEmailVerificationLink } from '$lib/utils/emails';
import { validateEmailVerificationToken } from '$lib/utils/token';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail, type Actions } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const verifyEmailForm = await superValidate(zod(verify_user_email_schema));
	return { verifyEmailForm, ...data };
};

export const actions: Actions = {
	verify: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, zod(verify_user_email_schema));
		let t: ToastSettings;
		try {
			const user = await validateEmailVerificationToken(form.data.code);
			const session = await lucia.createSession(user!.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			t = {
				message: 'Your Email has Successfully been Verified',
				background: 'variant-filled-success'
			};
		} catch (error) {
			t = {
				message: 'Failed to verify your email',
				background: 'variant-filled-warning'
			};
			setFlash(t, event);
			return fail(400, { form });
		}
		redirect('/', t, event);
	},
	resend: async (event) => {
		const { url, locals } = event;
		let t: ToastSettings;
		try {
			await sendEmailVerificationLink(locals.user!, url.origin);
			t = {
				message: `New Email Verification Link Sent ${locals.user?.username}`,
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
