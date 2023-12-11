import { fail, redirect } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import type { Session } from 'lucia';
import { setFlash } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { getActiveSubscription, userIsAllowedFreeTrial } from '$lib/utils/stripe/subscriptions';
export const actions = {
	checkout: async (event) => {
		const { request, url, locals } = event;
		const auth_session: Session = await locals.auth.validate();
		let t: ToastSettings;
		if (!auth_session) {
			t = {
				message: 'Must have an account to checkout',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			throw redirect(301, '/sign-in');
		}
		const active_sub = await getActiveSubscription(auth_session.user.userId);
		if (active_sub) {
			t = {
				message: 'You Already Have a Subscription',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return fail(409, { error: 'You Already Have a Subscription' });
		}
		if (!auth_session.user.email_verified) {
			t = {
				message: 'Must have a verified account to checkout',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			throw redirect(301, '/verify-email');
		}

		const data = await request.formData();
		const priceId = String(data.get('priceId'));

		if (!priceId || typeof priceId !== 'string') {
			return fail(400, { error: '`priceId` is required' });
		}

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
			subscription_data: !(await userIsAllowedFreeTrial(auth_session.user.stripe_id))
				? undefined
				: {
						trial_settings: {
							end_behavior: {
								missing_payment_method: 'cancel'
							}
						},
						trial_period_days: 30
					},
			payment_method_collection: 'always',
			success_url: `${url.origin}/settings`,
			cancel_url: `${url.origin}`,
			customer: auth_session.user.stripe_id,
			billing_address_collection: 'required',
			custom_text: { submit: { message: 'Thanks for trying out the free trial. - Dean' } }
		});

		throw redirect(303, stripeSession.url ?? '/');
	}
};
