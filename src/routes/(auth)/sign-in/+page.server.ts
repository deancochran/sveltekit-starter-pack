import { lucia } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signin_schema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash } from 'sveltekit-flash-message/server';
import * as argon from 'argon2';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const signinForm = await superValidate(zod(signin_schema));
	return { signinForm, ...data };
};

export const actions: Actions = {
	signin: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, zod(signin_schema));
		let t: ToastSettings;
		if (form.valid) {
			try {
				const user = await prisma.user.findUnique({ where: { email: form.data.email } });
				if (!user) {
					const t: ToastSettings = {
						message: 'Invalid Credentials Provided',
						background: 'variant-filled-warning'
					} as const;
					setFlash(t, event);
					return fail(500, { form });
				}
				const validPassword = await argon.verify(user.hashed_password, form.data.password);
				if (!validPassword) {
					const t: ToastSettings = {
						message: 'Invalid Credentials Provided',
						background: 'variant-filled-warning'
					} as const;
					setFlash(t, event);
					return fail(500, { form });
				}

				const session = await lucia.createSession(user.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				event.cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
				t = {
					message: `Welcome ${user.username}`,
					background: 'variant-filled-success'
				} as const;
			} catch (error) {
				const t: ToastSettings = {
					message: 'Unknown Error: Contact Support',
					background: 'variant-filled-warning'
				} as const;
				setFlash(t, event);
				return fail(500, { form });
			}
			redirect('/dashboard', t, event);
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
