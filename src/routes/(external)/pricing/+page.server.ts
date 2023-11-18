import { fail, redirect } from '@sveltejs/kit'
import { stripe } from '$lib/server/stripe'
import type { Session } from 'lucia'
import { setFlash } from 'sveltekit-flash-message/server';
import type { ToastSettings } from '@skeletonlabs/skeleton';

export const actions = {
	async checkout(event) {
		const { request, url, locals } = event
		// you could use `superValidate` instead but it's one field or
		// get `priceId` over the URL with `?/checkout?priceId=price_1234`
		const auth_session:Session = await locals.auth.validate();
		let t: ToastSettings;
		if (!auth_session) {
			t = {
				message: 'Must have an account to checkout',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			throw redirect(301, '/sign-in')
		}
		if (!auth_session.user.email_verified) {
			t = {
				message: 'Must have a verified account to checkout',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			throw redirect(301, '/verify-email')
		}
		
		const data = await request.formData()
		const priceId = String(data.get('priceId'))

		if (!priceId || typeof priceId !== 'string') {
			return fail(400, { error: '`priceId` is required' })
		}

		// this is going to trigger the `/stripe/webhook` endpoint
		const stripeSession = await stripe.checkout.sessions.create({
			mode: 'subscription',
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: `${url.origin}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.origin}/stripe/cancel`,
			customer_email: auth_session.user.email
		})

		throw redirect(303, stripeSession.url ?? '/')
	},
}