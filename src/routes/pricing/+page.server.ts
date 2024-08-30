import { db } from '$lib/drizzle/client';
import { user } from '$lib/drizzle/schema';
import { lucia } from '$lib/server/lucia';
import { stripe } from '$lib/server/stripe';
import { getActiveSubscription } from '$lib/server/stripe/subscriptions';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	return {
		...data
	};
};

export const actions = {
	checkout: async (event: RequestEvent) => {
		const { request, url } = event;
		const sessionId = event.cookies.get(lucia.sessionCookieName);
		let t: ToastSettings;
		if (!sessionId) {
			t = {
				message: 'Must have an account to checkout',
				background: 'variant-filled-warning'
			} as const;
			redirect('/sign-in', t, event);
		}

		const { session, user: _user } = await lucia.validateSession(sessionId);
		if (!_user) {
			t = {
				message: 'User Kicked for Security Measures',
				background: 'variant-filled-warning'
			} as const;
			redirect('/sign-in', t, event);
		}
		if (!_user.emailVerified) {
			t = {
				message: 'Must have a verified account to checkout',
				background: 'variant-filled-warning'
			} as const;
			redirect('/verify-email', t, event);
		}
		const activeSub = await getActiveSubscription(_user.id);
		if (activeSub) {
			t = {
				message: 'You Already Have a Subscription',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return fail(409, { error: 'You Already Have a Subscription' });
		}

		const data = await request.formData();
		const priceId = String(data.get('priceId'));

		if (!priceId || typeof priceId !== 'string') {
			return fail(400, { error: '`priceId` is required' });
		}
		const customer = await db.transaction(async (ctx) => {
			const newCustomer = await stripe.customers.create({
				email: _user.email
			});
			const [updatedUser] = await ctx
				.update(user)
				.set({
					stripeId: newCustomer.id
				})
				.returning();

			const newUser = await ctx.query.user.findFirst({
				where: eq(user.id, updatedUser.id),
				with: {
					subscriptions: true
				}
			});
			if (!newUser) throw new Error('No User Found');
			return newUser;
		});

		// this is going to trigger the `/stripe/webhook` endpoint
		const stripeSession = await stripe.checkout.sessions.create({
			mode: 'subscription',
			line_items: [
				{
					price: priceId,
					quantity: 1
				},
				{}
			],
			subscription_data: !customer.subscriptions
				? {
						trial_settings: {
							end_behavior: {
								missing_payment_method: 'cancel'
							}
						},
						trial_period_days: 30
					}
				: undefined,
			customer: customer.stripeId as string,
			payment_method_collection: 'always',
			success_url: `https://${url.origin}/settings`,
			cancel_url: `https://${url.origin}`,
			billing_address_collection: 'required',
			custom_text: !customer.subscriptions
				? { submit: { message: 'Start Your Free Trial' } }
				: undefined
		});

		redirect(303, stripeSession.url ?? '/');
	}
};
