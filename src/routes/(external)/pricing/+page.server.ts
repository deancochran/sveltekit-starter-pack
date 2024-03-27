import { fail } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { auth } from '$lib/server/lucia';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { setFlash, redirect } from 'sveltekit-flash-message/server';
import { getActiveSubscription } from '$lib/utils/stripe/subscriptions';

export const actions = {
	checkout: async (event) => {
		const { request, url } = event;
		const session_id = event.cookies.get(auth.sessionCookieName);
		let t: ToastSettings;
		if (!session_id) {
			t = {
				message: 'Must have an account to checkout',
				background: 'variant-filled-warning'
			} as const;
			redirect('/sign-in', t, event);
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { session, user } = await auth.validateSession(session_id);
		if (!user) {
			t = {
				message: 'User Kicked for Security Measures',
				background: 'variant-filled-warning'
			} as const;
			redirect('/sign-in', t, event);
		}
		if (!user.email_verified) {
			t = {
				message: 'Must have a verified account to checkout',
				background: 'variant-filled-warning'
			} as const;
			redirect('/verify-email', t, event);
		}
		const active_sub = await getActiveSubscription(user.id);
		if (active_sub) {
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
		const customer = await prisma.$transaction(async (db) => {
			const new_customer = await stripe.customers.create({
				email: user.email
			});
			return await db.user.update({
				where: {
					id: user.id
				},
				data: {
					stripe_id: new_customer.id
				}
			});
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
			subscription_data: {
				trial_settings: {
					end_behavior: {
						missing_payment_method: 'cancel'
					}
				},
				trial_period_days: 30
			},
			customer: customer.stripe_id as string,
			payment_method_collection: 'always',
			success_url: `${url.origin}/settings`,
			cancel_url: `${url.origin}`,
			billing_address_collection: 'required',
			custom_text: { submit: { message: 'Thanks for trying out the free trial. - Dean' } }
		});

		redirect(303, stripeSession.url ?? '/');
	}
};
