import { signinSchema } from '$lib/schemas';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import * as argon from 'argon2';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schema';
import { lucia } from '$lib/server/lucia';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const signinForm = await superValidate(zod(signinSchema));
	return { signinForm, ...data };
};

export const actions: Actions = {
	signin: async (event) => {
		const { request } = event;
		const form = await superValidate(request, zod(signinSchema));

		try {
			// use zod to validate the form.email_or_username is an email
			const emailSchema = z.string().email();
			const isEmail = emailSchema.safeParse(form.data.email_or_username);

			let _user;
			if (isEmail.success) {
				_user = await db.query.user.findFirst({
					where: eq(user.email, form.data.email_or_username)
				});
				if (!_user) throw new Error('No user founf');

				// else if it's a username
			} else {
				_user = await db.query.user.findFirst({
					where: eq(user.username, form.data.email_or_username)
				});
				if (!_user) throw new Error('Invalid Credentials Provided');
			}

			const validPassword = await argon.verify(
				_user.password,
				form.data.password
			);
			if (!validPassword) throw new Error('Invalid Credentials Provided');

			const newSession = await lucia.createSession(_user.id, {});
			const sessionCookie = lucia.createSessionCookie(newSession.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} catch (error) {
			let t: ToastSettings;
			if (error instanceof Error) {
				t = {
					message: error.message,
					background: 'variant-filled-warning'
				} as const;
			} else {
				t = {
					message: 'Unknown Error',
					background: 'variant-filled-error'
				} as const;
			}
			setFlash(t, event);
			return fail(500, { form });
		}
		const t: ToastSettings = {
			message: `Welcome`,
			background: 'variant-filled-success'
		} as const;
		redirect('/dashboard', t, event);
	}
};
