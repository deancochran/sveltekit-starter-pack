// routes/signup/+page.server.ts
import { auth } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import { sendEmailVerificationLink } from '$lib/utils/email';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signup_schema } from '$lib/forms/schemas';
import { setFlash } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// Server API:
	const signupForm = await superValidate(signup_schema);
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.email_verified) throw redirect(302, '/verify-email');
		throw redirect(302, '/');
	}
	// Unless you throw, always return { form } in load and form actions.
	const res = { signupForm };
	return res;
};

export const actions: Actions = {
	signup: async (event) => {
		const { request, locals, url } = event;
		const form = await superValidate(request, signup_schema);
		if (form.valid) {
			console.log(form)
			let session;
			try {
				const user = await auth.createUser({
					key: {
						providerId: 'email', // auth method
						providerUserId: form.data.email.toLocaleLowerCase(), // unique id when using "email" auth method
						password: form.data.password // hashed by Lucia
					},
					attributes: {
						email: form.data.email,
						username: form.data.username,
						email_verified: false
					}
				});

				session = await auth.createSession({
					userId: user.userId,
					attributes: {}
				});
				await sendEmailVerificationLink(user, url.origin);
				locals.auth.setSession(session);
				const t: ToastSettings = {
					message: `Successfully registered ${user.email}`,
					background: 'variant-filled-success'
				};
				setFlash(t, event);
				return {form}
			} catch (e) {
				return fail(500)
			}
		} else {
			const t: ToastSettings = {
				message: 'Invalid Form',
				background: 'variant-filled-warning'
			};
			setFlash(t, event);
			return {form}
		}
	}
};
