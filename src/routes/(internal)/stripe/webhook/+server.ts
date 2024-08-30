import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { upsertSubscription } from '$lib/server/stripe/subscriptions';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import type Stripe from 'stripe';

export async function POST(event: RequestEvent) {
	let stripeEventType: string | null = null;
	let stripeEvent;
	const { request } = event;

	const payload = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			payload,
			signature,
			STRIPE_WEBHOOK_SECRET
		);
		stripeEventType = stripeEvent.type;
	} catch (e) {
		error(500);
	}
	if (!stripeEvent.data.object) throw Error('Something went wrong');

	let subscription;
	switch (stripeEventType) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
		case 'customer.subscription.paused':
		case 'customer.subscription.resumed':
		case 'customer.subscription.pending_update_applied':
		case 'customer.subscription.pending_update_expired':
		case 'customer.subscription.trial_will_end':
		case 'customer.subscription.deleted':
			subscription = stripeEvent.data.object as Stripe.Subscription;
			await upsertSubscription(
				subscription.id,
				subscription.customer as string
			);
			return json({ message: 'success' }, { status: 200 });
		default:
	}

	return json({ message: 'success' }, { status: 201 });
}
