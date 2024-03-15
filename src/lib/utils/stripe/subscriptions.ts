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

export async function handleNewUserRole(
	subscription: Stripe.Response<Stripe.Subscription>
): Promise<UserRole> {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-expect-error
	const product_id = subscription.plan.product; // plan not found in subscription object type
	const product = await stripe.products.retrieve(product_id);
	switch (product.metadata['TIER']) {
		case UserRole.BASE:
			return UserRole.BASE;
		case UserRole.PRO:
			return UserRole.PRO;
		default:
			return UserRole.BASE;
	}
}

export async function handleSubsctiptionStatus(
	subscription_tier: UserRole,
	subscription_status: Stripe.Subscription.Status
): Promise<UserRole> {
	switch (subscription_status) {
		case 'incomplete':
			return UserRole.BASE;
		case 'incomplete_expired':
			return UserRole.BASE;
		case 'trialing':
			break;
		case 'active':
			break;
		case 'past_due':
			return UserRole.BASE;
		case 'canceled':
			return UserRole.BASE;
		case 'unpaid':
			return UserRole.BASE;
		default:
			return UserRole.BASE;
	}
	return subscription_tier;
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
			cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
			cancel_at_period_end: subscription.cancel_at_period_end,
			canceled_at: subscription.canceled_at
				? toDateTime(subscription.canceled_at).toISOString()
				: null,
			current_period_start: toDateTime(subscription.current_period_start).toISOString(),
			current_period_end: toDateTime(subscription.current_period_end).toISOString(),
			created_at: toDateTime(subscription.created).toISOString(),
			ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
			start_date: toDateTime(subscription.start_date).toISOString(),
			trial_start: subscription.trial_start
				? toDateTime(subscription.trial_start).toISOString()
				: null,
			trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
			metadata: subscription.metadata,
			status: subscription.status
		},
		update: {
			stripe_sub_id: subscription.id,
			user_id: user.id,
			cancel_at: subscription.cancel_at ? toDateTime(subscription.cancel_at).toISOString() : null,
			cancel_at_period_end: subscription.cancel_at_period_end,
			canceled_at: subscription.canceled_at
				? toDateTime(subscription.canceled_at).toISOString()
				: null,
			current_period_start: toDateTime(subscription.current_period_start).toISOString(),
			current_period_end: toDateTime(subscription.current_period_end).toISOString(),
			created_at: toDateTime(subscription.created).toISOString(),
			ended_at: subscription.ended_at ? toDateTime(subscription.ended_at).toISOString() : null,
			trial_start: subscription.trial_start
				? toDateTime(subscription.trial_start).toISOString()
				: null,
			trial_end: subscription.trial_end ? toDateTime(subscription.trial_end).toISOString() : null,
			metadata: subscription.metadata,
			status: subscription.status
		},
		where: {
			user_id: user.id
		}
	});

	const subscription_tier = await handleSubsctiptionStatus(
		await handleNewUserRole(subscription),
		subscription.status
	);
	await prisma.user.update({
		where: { id: user.id },
		data: { role: subscription_tier }
	});

	console.log(`Upserted subscription [${subscription.id}] for user [${user.id}]`);
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
