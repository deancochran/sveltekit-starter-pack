import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { stripe } from '$lib/server/stripe';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { superValidate } from 'sveltekit-superforms/server';
import {
	cancel_user_subscription_schema,
	delete_user_schema,
	send_new_user_email_code_schema,
	update_ftp_schema,
	update_user_email_schema,
	update_user_password_schema,
	update_user_schema
} from '$lib/schemas';
import { validateEmailVerificationToken } from '$lib/utils/token';
import { auth } from '$lib/server/lucia';
import * as argon from 'argon2';
import { sendEmailChangeCode } from '$lib/utils/emails';
import { fail } from '@sveltejs/kit';
import { getActiveSubscription } from '$lib/utils/stripe/subscriptions';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const data = await parent();
	const initialData = { ...data.user };
	const updateUserForm = await superValidate(initialData, zod(update_user_schema));
	const updateUserEmailForm = await superValidate(zod(update_user_email_schema));
	const sendNewUserEmailCodeForm = await superValidate(
		initialData,
		zod(send_new_user_email_code_schema)
	);
	const deleteUserForm = await superValidate(zod(delete_user_schema));
	const updateUserEmailPasswordForm = await superValidate(zod(update_user_password_schema));
	const cancelUserSubscriptionForm = await superValidate(zod(cancel_user_subscription_schema));
	const updateFTPForm = await superValidate(initialData, zod(update_ftp_schema));
	return {
		updateUserForm,
		updateFTPForm,
		updateUserEmailForm,
		sendNewUserEmailCodeForm,
		deleteUserForm,
		updateUserEmailPasswordForm,
		cancelUserSubscriptionForm,
		...data
	};
};

export const actions: Actions = {
	deleteUser: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(delete_user_schema));

		let success = false;
		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const subscription = await getActiveSubscription(locals.user!.id);
			if (subscription) await stripe.subscriptions.cancel(subscription?.stripe_sub_id);
			if (locals.user!.stripe_id) await stripe.customers.del(locals.user!.stripe_id);
			await prisma.user.delete({
				where: {
					id: locals.user!.id
				}
			});
			success = true;
		} catch (e) {
			const t: ToastSettings = {
				message: 'Failed to delete account',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
		}
		if (success) {
			const t = {
				message: 'Successfully deleted your account',
				background: 'variant-filled-success'
			} as const;
			throw redirect('/', t, event);
		}
	},
	updateUser: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(update_user_schema));

		try {
			if (!form.valid) throw new Error('Must provide valid credentials');
			if (form.data.username === locals.user!.username)
				throw new Error('Must choose a new username');
			await prisma.user.update({
				where: { id: locals.user!.id },
				data: { username: form.data.username }
			});
			const session = await auth.createSession(locals.user!.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			const t: ToastSettings = {
				message: 'Updated Username',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			let t: ToastSettings;
			if (e instanceof Error) {
				t = {
					message: e.message,
					background: 'variant-filled-error'
				} as const;
			} else {
				t = {
					message: 'Failed to update Username',
					background: 'variant-filled-error'
				} as const;
			}
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	updateUserEmail: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(update_user_email_schema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid email and code');
			await validateEmailVerificationToken(form.data.code);
			await prisma.user.update({
				where: { id: locals.user!.id },
				data: { email: form.data.email }
			});
			const session = await auth.createSession(locals.user!.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			t = {
				message: 'Updated Email',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to update Email',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	sendUserEmailCode: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(send_new_user_email_code_schema));
		console.log('submitting email for new code');

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid email');
			if (form.data.email === locals.user!.email) throw new Error('Must choose a new email');
			await sendEmailChangeCode(locals.user!, form.data.email);
			t = {
				message: `A Code to verify your new email was sent`,
				background: 'variant-filled-success'
			};
			setFlash(t, event);
			return { form };
		} catch (e) {
			if (e instanceof Error) {
				t = {
					message: e.message,
					background: 'variant-filled-error'
				} as const;
			} else {
				t = {
					message: 'Unknown Error',
					background: 'variant-filled-error'
				} as const;
			}
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	updateFTP: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(update_ftp_schema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid ftp values');
			await prisma.user.update({
				where: {
					id: locals.user!.id
				},
				data: {
					...form.data
				}
			});
			t = {
				message: 'Updated FTP Settings',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to update FTP Settings',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	updateUserPassword: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(update_user_password_schema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid passwords');

			const hashed_password = await argon.hash(form.data.password);
			await prisma.user.update({
				where: {
					id: locals.user!.id
				},
				data: {
					hashed_password: hashed_password
				}
			});
			const session = await auth.createSession(locals.user!.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			t = {
				message: 'Updated Password',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to update Password',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	cancelSubscription: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(cancel_user_subscription_schema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const active_subscription = await getActiveSubscription(locals.user!.id);
			if (!active_subscription) throw new Error('User has no active subscription');
			await stripe.subscriptions.cancel(active_subscription.stripe_sub_id);
			t = {
				message: 'Cancelled Subscription',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			if (e instanceof Error) {
				t = {
					message: e.message,
					background: 'variant-filled-error'
				} as const;
			} else {
				t = {
					message: 'Failed to cancel Subscription',
					background: 'variant-filled-error'
				} as const;
			}
			setFlash(t, event);
			return fail(400, { form });
		}
	}
	// updateUserProfilePicture: async (event) => {

	// 	const { request, locals } = event;
	// 	const session = await locals.auth.validate();
	// 	const formData = await request.formData();
	// 	let t: ToastSettings;
	// 	try {
	// 		const file = Object.fromEntries(formData).file;
	// 		if (file instanceof File) {
	// 			await uploadProfilePicture(session.user.userId, file);
	// 			t = {
	// 				message: 'Updated Profile Picture',
	// 				background: 'variant-filled-success'
	// 			} as const;
	// 			setFlash(t, event);
	// 		} else {
	// 			throw new Error('Must provide a file');
	// 		}
	// 	} catch (e) {

	// 		t = {
	// 			message: 'Failed to update Profile Picture',
	// 			background: 'variant-filled-error'
	// 		} as const;
	// 		setFlash(t, event);
	// 	}
	// }
};
