import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken, user } from '$lib/drizzle/schema';
import { disconnectIntegration } from '$lib/integrations/strava/utils';
import {
	cancelUserSubscriptionSchema,
	deleteUserSchema,
	disconnectUserIntegrationSchema,
	newClubSchema,
	newImageSchema,
	sendNewUserEmailCodeSchema,
	updateFtpHrSchema,
	updateUserEmailSchema,
	updateUserPasswordSchema,
	updateUserSchema
} from '$lib/schemas';
import { lucia } from '$lib/server/lucia';
import { stripe } from '$lib/server/stripe';
import { getActiveSubscription } from '$lib/server/stripe/subscriptions';
import { sendEmailChangeCode } from '$lib/utils/emails';
import { PICTURE_BUCKET, uploadImage } from '$lib/utils/minio/helpers';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { validateEmailVerificationToken } from '$lib/utils/token';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail } from '@sveltejs/kit';
import * as argon from 'argon2';
import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, withFiles } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent, locals } = event;
	const data = await parent();
	const initialData = { ...data.user };
	if (!locals.user) redirect(302, handleSignInRedirect(event));
	const updateUserForm = await superValidate(
		initialData,
		zod(updateUserSchema)
	);
	const updateUserEmailForm = await superValidate(zod(updateUserEmailSchema));
	const sendNewUserEmailCodeForm = await superValidate(
		initialData,
		zod(sendNewUserEmailCodeSchema)
	);
	const deleteUserForm = await superValidate(zod(deleteUserSchema));
	const updateUserEmailPasswordForm = await superValidate(
		zod(updateUserPasswordSchema)
	);
	const cancelUserSubscriptionForm = await superValidate(
		zod(cancelUserSubscriptionSchema)
	);
	const updateFTPForm = await superValidate(
		{
			bikeFtp: initialData.bikeFtp,
			swimFtp: initialData.swimFtp,
			runFtp: initialData.runFtp,
			max_hr: initialData.maxHr
		},
		zod(updateFtpHrSchema)
	);
	const integrationsForm = await superValidate(
		zod(disconnectUserIntegrationSchema)
	);
	const userAvatarForm = await superValidate(zod(newImageSchema));
	const userBannerForm = await superValidate(zod(newImageSchema));

	const userIntegrations = await db.query.thirdPartyIntegrationToken.findMany({
		where: eq(thirdPartyIntegrationToken.userId, locals.user.id)
	});

	return {
		updateUserForm,
		updateFTPForm,
		updateUserEmailForm,
		sendNewUserEmailCodeForm,
		deleteUserForm,
		updateUserEmailPasswordForm,
		cancelUserSubscriptionForm,
		userIntegrations,
		integrationsForm,
		userAvatarForm,
		userBannerForm,
		...data
	};
};

export const actions: Actions = {
	deleteUser: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(deleteUserSchema));

		let success = false;
		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const subscription = await getActiveSubscription(locals.user!.id);
			if (subscription)
				await stripe.subscriptions.cancel(subscription?.stripeSubId);
			if (locals.user!.stripeId)
				await stripe.customers.del(locals.user!.stripeId);
			await db.delete(user).where(eq(user.id, locals.user!.id));
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
			redirect('/', t, event);
		}
	},
	updateUser: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(updateUserSchema));

		try {
			if (!form.valid) throw new Error('Must provide valid credentials');
			if (form.data.username === locals.user!.username)
				throw new Error('Must choose a new username');

			await db
				.update(user)
				.set({ username: form.data.username })
				.where(eq(user.id, locals.user!.id));
			const session = await lucia.createSession(locals.user!.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
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
		const form = await superValidate(request, zod(updateUserEmailSchema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid email and code');
			await validateEmailVerificationToken(form.data.code);
			await db
				.update(user)
				.set({ email: form.data.email })
				.where(eq(user.id, locals.user!.id));
			const session = await lucia.createSession(locals.user!.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
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
		const form = await superValidate(request, zod(sendNewUserEmailCodeSchema));
		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid email');
			if (form.data.email === locals.user!.email)
				throw new Error('Must choose a new email');
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
	updateFTPHR: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(updateFtpHrSchema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid values');
			await db
				.update(user)
				.set({
					maxHr: form.data.max_hr,
					bikeFtp: form.data.bikeFtp,
					runFtp: form.data.runFtp,
					swimFtp: form.data.swimFtp
				})
				.where(eq(user.id, locals.user!.id));

			t = {
				message: 'Updated Settings',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to update Settings',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	updateUserPassword: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(updateUserPasswordSchema));

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide valid passwords');

			const hashedPassword = await argon.hash(form.data.password);
			await db
				.update(user)
				.set({
					password: hashedPassword
				})
				.where(eq(user.id, locals.user!.id));

			const session = await lucia.createSession(locals.user!.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
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
		const form = await superValidate(
			request,
			zod(cancelUserSubscriptionSchema)
		);

		let t: ToastSettings;
		try {
			if (!form.valid) throw new Error('Must provide a valid password');
			const activeSubscription = await getActiveSubscription(locals.user!.id);
			if (!activeSubscription)
				throw new Error('User has no active subscription');
			await stripe.subscriptions.cancel(activeSubscription.stripeSubId);
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
	disconnect_integration: async (event) => {
		const form = await superValidate(
			event.request,
			zod(disconnectUserIntegrationSchema)
		);
		let t: ToastSettings;
		try {
			if (!event.locals?.user) throw new Error('User must be logged in');
			if (!form.valid) throw new Error('Must provide a valid integration');
			await db.transaction(async (ctx) => {
				const integration =
					await ctx.query.thirdPartyIntegrationToken.findFirst({
						where: and(
							eq(thirdPartyIntegrationToken.userId, event.locals.user!.id),
							eq(thirdPartyIntegrationToken.provider, form.data.provider)
						)
					});
				if (!integration) throw new Error('No integration Found');
				await disconnectIntegration(integration);

				await ctx
					.delete(thirdPartyIntegrationToken)
					.where(eq(thirdPartyIntegrationToken.id, integration.id));
			});
			t = {
				message: 'Disconnected Integration',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to disconnect Integration',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	updateUserAvatar: async (event) => {
		const { request, locals } = event;
		if (!locals?.user) throw new Error('User must be logged in');
		const formData = await request.formData();
		const form = await superValidate(formData, zod(newClubSchema));

		if (!form.valid) return fail(400, withFiles({ form }));

		const image = formData.get('image');
		if (!(image instanceof File)) return fail(400, withFiles({ form }));
		try {
			await db.transaction(async (ctx) => {
				const uuid = randomUUID();
				if (locals.user?.avatarFileId) {
					await uploadImage(PICTURE_BUCKET, locals.user.avatarFileId, image);
				} else {
					await uploadImage(PICTURE_BUCKET, uuid, image);
				}

				await ctx
					.update(user)
					.set({
						avatarFileId: locals.user!.avatarFileId ?? uuid
					})
					.where(eq(user.id, locals.user!.id));
			});
			const t: ToastSettings = {
				message: 'Updated Profile Picture',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);

			return withFiles({ form });
		} catch (error) {
			const t: ToastSettings = {
				message: 'Failed to update Profile Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
	},
	updateUserBanner: async (event) => {
		const { request, locals } = event;
		if (!locals?.user) throw new Error('User must be logged in');
		const formData = await request.formData();
		const form = await superValidate(formData, zod(newClubSchema));

		if (!form.valid) return fail(400, withFiles({ form }));

		const image = formData.get('image');
		if (!(image instanceof File)) return fail(400, withFiles({ form }));
		try {
			await db.transaction(async (ctx) => {
				const uuid = randomUUID();
				if (locals.user?.bannerFileId) {
					await uploadImage(PICTURE_BUCKET, locals.user.bannerFileId, image);
				} else {
					await uploadImage(PICTURE_BUCKET, uuid, image);
				}

				await ctx
					.update(user)
					.set({
						bannerFileId: locals.user!.bannerFileId ?? uuid
					})
					.where(eq(user.id, locals.user!.id));
			});
			const t: ToastSettings = {
				message: 'Updated Profile Banner Picture',
				background: 'variant-filled-success'
			} as const;
			setFlash(t, event);

			return withFiles({ form });
		} catch (error) {
			const t: ToastSettings = {
				message: 'Failed to update Profile Banner Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
	},
	subscriptions: async (event) => {
		const { locals } = event;
		if (!locals?.user) throw new Error('User must be logged in');
		// if user is not a subscriber, redirect to pricing page
		const _user = await db.query.user.findFirst({
			where: eq(user.id, locals.user.id)
		});
		if (!_user) {
			throw redirect(302, '/');
		}

		if (!_user.stripeId) {
			throw redirect(302, '/pricing');
		}
		const session = await stripe.billingPortal.sessions.create({
			customer: _user.stripeId,
			return_url: `https://localhost:5173/settings/`
		});
		throw redirect(302, session.url);
	}
};
