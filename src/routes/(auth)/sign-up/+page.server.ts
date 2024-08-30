import { setConsentCookie } from '$lib/cookies';
import { db } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schema';
import { signupSchema } from '$lib/schemas';
import { lucia } from '$lib/server/lucia';
import { sendEmailVerificationLink } from '$lib/utils/emails';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import * as argon from 'argon2';
import { generateId } from 'lucia';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	await parent();
	const signupForm = await superValidate(zod(signupSchema));
	return { signupForm };
};

export const actions: Actions = {
	signup: async (event) => {
		console.log(event);
		const { request } = event;
		const form = await superValidate(request, zod(signupSchema));
		if (form.valid) {
			try {
				const password = await argon.hash(form.data.password);

				const [_user] = await db
					.insert(user)
					.values({
						id: generateId(15),
						username: form.data.username,
						email: form.data.email,
						password: password,
						updatedAt: new Date()
					})
					.returning();

				setConsentCookie(event);
				const session = await lucia.createSession(_user.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				await sendEmailVerificationLink(_user);
			} catch (error) {
				let t: ToastSettings;
				// eslint-disable-next-line prefer-const
				t = {
					message: `Unknown Error:`,
					background: 'variant-filled-warning'
				} as const;
				setFlash(t, event);
				return fail(500, { form });
			}
			const t: ToastSettings = {
				message: `Successfully Registered`,
				background: 'variant-filled-success'
			} as const;
			redirect('/dashboard', t, event);
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
