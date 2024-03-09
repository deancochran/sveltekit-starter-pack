import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { stripe } from '$lib/server/stripe';
import type { Session } from 'lucia';
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
import { sendEmailChangeCode } from '$lib/utils/emails';
import { fail } from '@sveltejs/kit';
import { getActiveSubscription } from '$lib/utils/stripe/subscriptions';

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const data = await parent();
	const initialData = { ...data.session.user };
	const updateUserForm = await superValidate(initialData, update_user_schema);
	const updateUserEmailForm = await superValidate(update_user_email_schema);
	const sendNewUserEmailCodeForm = await superValidate(
		initialData,
		send_new_user_email_code_schema
	);
	const deleteUserForm = await superValidate(delete_user_schema);
	const updateUserEmailPasswordForm = await superValidate(update_user_password_schema);
	const cancelUserSubscriptionForm = await superValidate(cancel_user_subscription_schema);
	const updateFTPForm = await superValidate(
		initialData,
		update_ftp_schema);
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
		const form = await superValidate(request, delete_user_schema);
		const session: Session = await locals.auth.validate();
		let success = false;
		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const key = await auth.useKey('email', session.user.email, form.data.password);
			if (key.userId != session.user.userId) throw new Error('Invalid Request');
			const subscription = await getActiveSubscription(session.user.userId);
			if (subscription) await stripe.subscriptions.cancel(subscription?.stripe_sub_id);
			await stripe.customers.del(session.user.stripe_id);
			await auth.deleteUser(session.user.userId);
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
		let session: Session = await locals.auth.validate();
		const form = await superValidate(request, update_user_schema);

		try {
			if (!form.valid) throw new Error('Must provide valid credentials');
			if (form.data.username === session.user.username)
				throw new Error('Must choose a new username');
			await auth.updateUserAttributes(session.user.userId, {
				username: form.data.username
			});
			await auth.invalidateAllUserSessions(session.user.userId); // invalidate all user sessions => logout all sessions
			session = await auth.createSession({
				userId: session.user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
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
		const form = await superValidate(request, update_user_email_schema);
		let session = await locals.auth.validate();
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid email and code');
			const userId = await validateEmailVerificationToken(form.data.code);
			if (userId != session.user.userId) throw new Error('User Provided an Invalid Code');
			await auth.updateUserAttributes(userId, {
				email: form.data.email
			});
			await auth.invalidateAllUserSessions(session.user.userId); // invalidate all user sessions => logout all sessions
			session = await auth.createSession({
				userId: session.user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
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
		const session = await locals.auth.validate();
		const form = await superValidate(request, send_new_user_email_code_schema);
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid email');
			if (form.data.email === session.user.email) throw new Error('Must choose a new email');
			await sendEmailChangeCode(session.user, form.data.email);
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
		const form = await superValidate(request, update_ftp_schema);
		const session = await locals.auth.validate();
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid ftp values');
			await prisma.user.update({
				where:{
					id:session.user.userId
				},
				data:{
					...form.data
				}
			})
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
		const form = await superValidate(request, update_user_password_schema);
		let session = await locals.auth.validate();
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid passwords');
			await auth.updateKeyPassword('email', session.user.email, form.data.password);
			await auth.invalidateAllUserSessions(session.user.userId); // invalidate all user sessions => logout all sessions
			session = await auth.createSession({
				userId: session.user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
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
		const form = await superValidate(request, cancel_user_subscription_schema);
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const session = await locals.auth.validate();
			const key = await auth.useKey('email', session.user.email, form.data.password);
			if (key.userId != session.user.userId) throw new Error('Invalid Password');
			const active_subscription = await getActiveSubscription(session.user.userId);
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
	},
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
