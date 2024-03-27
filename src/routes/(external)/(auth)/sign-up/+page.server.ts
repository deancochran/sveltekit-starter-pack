import { auth } from '$lib/server/lucia';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signup_schema } from '$lib/schemas';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError
} from '@prisma/client/runtime/library';
// import { stripe } from '$lib/server/stripe';
import { sendEmailVerificationLink } from '$lib/utils/emails';
import { generateId, type User } from 'lucia';
import * as argon from 'argon2';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	await parent();
	const signupForm = await superValidate(zod(signup_schema));
	return { signupForm };
};

export const actions: Actions = {
	signup: async (event) => {
		const { request, url } = event;
		const form = await superValidate(request, zod(signup_schema));
		if (form.valid) {
			try {


				const hashedPassword = await argon.hash(form.data.password);
				const user = await prisma.user.create({
					data: {
						id: generateId(15),
						username: form.data.username,
						email: form.data.email,
						hashed_password: hashedPassword
					}
				});

				const session = await auth.createSession(user.id, {});
				const sessionCookie = auth.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				await sendEmailVerificationLink(user as unknown as User, url.origin);
			} catch (error) {
				let t: ToastSettings;
				if (error instanceof PrismaClientKnownRequestError) {
					t = {
						message: 'Request Error',
						background: 'variant-filled-warning'
					} as const;
					if (error.meta) {
						if (error.meta.target == 'email')
							t = {
								message: 'Email Already Exists',
								background: 'variant-filled-warning'
							} as const;
						if (error.meta.target == 'username')
							t = {
								message: 'Username Already Exists',
								background: 'variant-filled-warning'
							} as const;
					}
				} else if (error instanceof PrismaClientUnknownRequestError) {
					t = {
						message: error.message,
						background: 'variant-filled-warning'
					} as const;
				} else {
					t = {
						message: `Unknown Error:`,
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
			redirect('/verify-email', t, event);
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
