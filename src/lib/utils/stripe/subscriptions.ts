import { stripe } from '$lib/server/stripe';
import { UserRole } from '@prisma/client';
import { toDateTime } from '../datetime';
import type Stripe from 'stripe';

export async function getActiveSubscription(user_id: string) {
	const res = await prisma.subscription.findFirst({ where: { user_id: user_id, ended_at: null } });
	return res;
}

export async function userIsAllowedFreeTrial(user_id: string) {
	const trial = await prisma.subscription.findFirst({
		where: { user_id: user_id, trial_start: { not: null } }
	});
	return trial ? true : false;
}

export async function handleSubscriptionStatus(
	subscription: Stripe.Subscription
): Promise<UserRole> {
	const status = subscription.status;
	switch (status) {
		case 'incomplete':
			return UserRole.BASE;
		case 'paused':
			return UserRole.BASE;
		case 'incomplete_expired':
			return UserRole.BASE;
		case 'trialing':
			return UserRole.TRIAL;
		case 'active':
			return UserRole.PRO;
		case 'past_due':
			return UserRole.BASE;
		case 'canceled':
			return UserRole.BASE;
		case 'unpaid':
			return UserRole.BASE;
		default:
			return UserRole.BASE;
	}
}

export type STRIPE_SUBSCRIPTION_EVENTS =
	| 'customer.subscription.created'
	| 'customer.subscription.updated'
	| 'customer.subscription.deleted'
	| 'customer.subscription.paused'
	| 'customer.subscription.resumed'
	| 'customer.subscription.pending_update_applied'
	| 'customer.subscription.pending_update_expired'
	| 'customer.subscription.trial_will_end';

export async function upsertSubscription(subscriptionId: string, stripe_user_id: string) {
	const user = await prisma.user.findUnique({
		where: { stripe_id: stripe_user_id }
	});

	if (!user) throw new Error('no user found with the provided stripe id');

	const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method', 'plan']
	});

	await prisma.subscription.upsert({
		create: {
			stripe_sub_id: subscription.id,
			user_id: user.id,
			cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at) : null,
			cancel_at_period_end: subscription.cancel_at_period_end,
			canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at) : null,
			current_period_start: toDateTime(subscription.current_period_start),
			current_period_end: toDateTime(subscription.current_period_end),
			created_at: toDateTime(subscription.created),
			ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
			start_date: toDateTime(subscription.start_date),
			trial_start: subscription.trial_start ? toDateTime(subscription.trial_start) : null,
			trial_end: subscription.trial_end ? toDateTime(subscription.trial_end) : null,
			metadata: subscription.metadata,
			status: subscription.status
		},
		update: {
			stripe_sub_id: subscription.id,
			user_id: user.id,
			cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at) : null,
			cancel_at_period_end: subscription.cancel_at_period_end,
			canceled_at: subscription.canceled_at ? toDateTime(subscription.canceled_at) : null,
			current_period_start: toDateTime(subscription.current_period_start),
			current_period_end: toDateTime(subscription.current_period_end),
			created_at: toDateTime(subscription.created),
			ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
			trial_start: subscription.trial_start ? toDateTime(subscription.trial_start) : null,
			trial_end: subscription.trial_end ? toDateTime(subscription.trial_end) : null,
			metadata: subscription.metadata,
			status: subscription.status
		},
		where: {
			user_id: user.id
		}
	});
	const subscription_tier = await handleSubscriptionStatus(subscription);
	const new_user = await prisma.user.update({
		where: { id: user.id },
		data: { role: subscription_tier }
	});

	console.log(`Upserted ${new_user.username}'s subscription to ${new_user.role} TIER`);
}

export async function deleteSubscription(subscriptionId: string, stripe_user_id: string) {
	const user = await prisma.user.findUnique({
		where: { stripe_id: stripe_user_id }
	});

	if (!user) throw new Error('no user found with the provided stripe id');

	const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method', 'plan']
	});

	await prisma.subscription.delete({
		where: {
			user_id: user.id
		}
	});

	console.log(`Delete subscription [${subscription.id}] for user [${user.id}]`);
}
