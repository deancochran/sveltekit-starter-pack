import { auth } from '$lib/server/lucia';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { signin_schema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash } from 'sveltekit-flash-message/server';
import { LuciaError } from 'lucia';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const signinForm = await superValidate(signin_schema);
	return { signinForm, ...data };
};

export const actions: Actions = {
	signin: async (event) => {
		const { request, locals } = event;
		const form = await superValidate(request, signin_schema);
		let session;
		if (form.valid) {
			try {
				const key = await auth.useKey(
					'email',
					form.data.email.toLocaleLowerCase(),
					form.data.password
				);
				session = await auth.createSession({
					userId: key.userId,
					attributes: {}
				});
				locals.auth.setSession(session); // set session cookie
			} catch (error) {
				if (
					error instanceof LuciaError &&
					(error.message === 'AUTH_INVALID_KEY_ID' || error.message === 'AUTH_INVALID_PASSWORD')
				) {
					const t: ToastSettings = {
						message: 'Invalid Credentials Provided',
						background: 'variant-filled-warning'
					} as const;
					await setFlash(t, event);
				} else {
					const t: ToastSettings = {
						message: 'Unknown Error',
						background: 'variant-filled-warning'
					} as const;
					await setFlash(t, event);
				}

				return fail(500, { form });
			}
			const t: ToastSettings = {
				message: `Welcome ${session.user.username}`,
				background: 'variant-filled-success'
			} as const;
			throw redirect('/', t, event);
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
