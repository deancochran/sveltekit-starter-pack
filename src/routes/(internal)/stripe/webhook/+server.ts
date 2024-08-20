import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import { upsertSubscription } from '$lib/utils/stripe/subscriptions';
import { error, json } from '@sveltejs/kit';
import type Stripe from 'stripe';

export async function POST(event) {
	let stripe_event_type: string | null = null;
	let stripe_event;
	const { request } = event;

	const payload = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	try {
		stripe_event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
		stripe_event_type = stripe_event.type;
	} catch (e) {
		error(500);
	}
	if (!stripe_event.data.object) throw Error('Something went wrong');

	let subscription;
	switch (stripe_event_type) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
		case 'customer.subscription.paused':
		case 'customer.subscription.resumed':
		case 'customer.subscription.pending_update_applied':
		case 'customer.subscription.pending_update_expired':
		case 'customer.subscription.trial_will_end':
		case 'customer.subscription.deleted':
			subscription = stripe_event.data.object as Stripe.Subscription;
			await upsertSubscription(subscription.id, subscription.customer as string);
			return json({ message: 'success' }, { status: 200 });
		default:
	}

	return json({ message: 'success' }, { status: 201 });
}
