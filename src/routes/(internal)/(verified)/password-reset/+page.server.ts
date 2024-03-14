import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { sendPasswordResetLink } from '$lib/utils/emails';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash } from 'sveltekit-flash-message/server';
import { resend_reset_pass_schema } from '$lib/schemas';
import { superValidate } from 'sveltekit-superforms/server';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const resendPassResetForm = await superValidate(resend_reset_pass_schema);
	return { resendPassResetForm };
};

export const actions: Actions = {
	resend: async (event) => {
		const { url, request, locals } = event;
		const form = await superValidate(request, resend_reset_pass_schema);

		if (form.valid) {
			try {
				await sendPasswordResetLink(locals.user!, url.origin);
				const t: ToastSettings = {
					message: `A New Password Reset Link was sent to ${locals.user!.email}`,
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
				const t: ToastSettings = {
					message: message,
					background: 'variant-filled-warning'
				} as const;
				await setFlash(t, event);
				return fail(500, { form });
			}
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
