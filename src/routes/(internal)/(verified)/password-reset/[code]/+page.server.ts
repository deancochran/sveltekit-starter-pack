import { auth } from '$lib/server/lucia';
import { validatePasswordResetToken } from '$lib/utils/token';
import { superValidate } from 'sveltekit-superforms/server';
import { reset_pass_schema } from '$lib/schemas';
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
		const { request, params } = event;
		const form = await superValidate(request, reset_pass_schema);
		let t: ToastSettings;
		let valid;
		if (form.valid) {
			try {
				const user = await validatePasswordResetToken(String(params.code), form.data.password);
				const session = await auth.createSession(user.id, {});
				const sessionCookie = auth.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
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
