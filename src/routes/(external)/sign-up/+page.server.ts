import { auth } from '$lib/server/lucia';
import type { Actions } from './$types';
import { sendEmailVerificationLink } from '$lib/utils/email';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signup_schema } from '$lib/forms/schemas';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const load: PageServerLoad = async ({ locals }) => {
	const signupForm = await superValidate(signup_schema);
	const session = await locals.auth.validate();
	if (session) {
		if (!session.user.email_verified) throw redirect(302, '/verify-email');
		throw redirect(302, '/');
	}
	return { signupForm };
};

export const actions: Actions = {
	signup: async (event) => {
		const { request, locals, url } = event;
		const form = await superValidate(request, signup_schema);
		let session;
		if (form.valid) {
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
			} catch (error) {
				let t: ToastSettings
				if (error instanceof PrismaClientKnownRequestError) {
					t = {
						message: 'Request Error',
						background: 'variant-filled-warning'
					} as const;
					if(error.meta){
						if(error.meta.target == 'email')
						// invalid key or pass
						t = {
							message: 'Email Already Exists',
							background: 'variant-filled-warning'
						} as const;
						if(error.meta.target == 'username')
						// invalid key or pass
						t = {
							message: 'Username Already Exists',
							background: 'variant-filled-warning'
						} as const;

					}
				}else{
					t = {
						message: "Unknown Error",
						background: 'variant-filled-warning'
					} as const;

				}				
				setFlash(t, event);
				return fail(500, { form });
			}
			const t: ToastSettings = {
				message: `Successfully Registered`,
				background: 'variant-filled-success'
			} as const;
			throw redirect('/verify-email',t, event)
		} else {
			const t: ToastSettings = {
				message: 'Invalid Form',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	}
};
