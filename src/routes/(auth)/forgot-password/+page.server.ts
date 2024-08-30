import { user as userTable } from '$lib/drizzle/schema';
import {
	forgotPassSchema,
	resetForgotPassSchema,
	signinSchema
} from '$lib/schemas';

import { db } from '$lib/drizzle/client';
import { sendForgottenPasswordResetLink } from '$lib/utils/emails';
import { validatePasswordResetToken } from '$lib/utils/token';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const forgotPassForm = await superValidate(zod(signinSchema));
	const resetForgotPassForm = await superValidate(zod(resetForgotPassSchema));
	return { forgotPassForm, resetForgotPassForm };
};

export const actions: Actions = {
	forgot: async (event) => {
		const { url, request } = event;
		const form = await superValidate(request, zod(forgotPassSchema));
		let t: ToastSettings;
		try {
			const user = db
				.select()
				.from(userTable)
				.where(eq(userTable.email, form.data.email))
				.limit(1);

			if (!user) throw new Error('No User Found');

			await sendForgottenPasswordResetLink(user as unknown as User, url.origin);

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
		const { request } = event;
		const form = await superValidate(request, zod(resetForgotPassSchema));
		let t: ToastSettings;
		if (form.valid) {
			try {
				await validatePasswordResetToken(form.data.code, form.data.password);
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
