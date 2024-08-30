import { db } from '$lib/drizzle/client';
import { subscription, user } from '$lib/drizzle/schema';
import { stripe } from '$lib/server/stripe';
import { toDateTime } from '$lib/utils/datetime';
import { and, eq, isNotNull, isNull } from 'drizzle-orm';
import type Stripe from 'stripe';

export async function getActiveSubscription(userId: string) {
	return await db.query.subscription.findFirst({
		where: and(eq(subscription.userId, userId), isNull(subscription.endedAt))
	});
}

export async function userIsAllowedFreeTrial(userId: string) {
	const trial = await db.query.subscription.findFirst({
		where: and(eq(subscription.userId, userId), isNotNull(subscription.endedAt))
	});
	return trial ? true : false;
}

export async function handleSubscriptionStatus(
	subscription: Stripe.Subscription
): Promise<'BASE' | 'TRIAL' | 'PRO'> {
	const status = subscription.status;
	switch (status) {
		case 'incomplete':
			return 'BASE';
		case 'paused':
			return 'BASE';
		case 'incomplete_expired':
			return 'BASE';
		case 'trialing':
			return 'TRIAL';
		case 'active':
			return 'PRO';
		case 'past_due':
			return 'BASE';
		case 'canceled':
			return 'BASE';
		case 'unpaid':
			return 'BASE';
		default:
			return 'BASE';
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

export async function upsertSubscription(
	subscriptionId: string,
	stripeUserId: string
) {
	const _user = await db.query.user.findFirst({
		where: eq(user.id, stripeUserId)
	});

	if (!_user) throw new Error('no user found with the provided stripe id');

	const _subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method', 'plan']
	});

	await db
		.insert(subscription)
		.values({
			stripeSubId: _subscription.id,
			userId: _user.id,
			cancelAt: _subscription.cancel_at
				? toDateTime(_subscription.cancel_at)
				: null,
			cancelAtPeriodEnd: _subscription.cancel_at_period_end,
			canceledAt: _subscription.canceled_at
				? toDateTime(_subscription.canceled_at)
				: null,
			currentPeriodStart: toDateTime(_subscription.current_period_start),
			currentPeriodEnd: toDateTime(_subscription.current_period_end),
			createdAt: toDateTime(_subscription.created),
			endedAt: _subscription.ended_at
				? toDateTime(_subscription.ended_at)
				: null,
			startDate: toDateTime(_subscription.start_date),
			trialStart: _subscription.trial_start
				? toDateTime(_subscription.trial_start)
				: null,
			trialEnd: _subscription.trial_end
				? toDateTime(_subscription.trial_end)
				: null,
			metadata: _subscription.metadata,
			status: _subscription.status
		})
		.onConflictDoUpdate({
			target: subscription.userId,
			set: {
				stripeSubId: _subscription.id,
				userId: _user.id,
				cancelAt: _subscription.cancel_at
					? toDateTime(_subscription.cancel_at)
					: null,
				cancelAtPeriodEnd: _subscription.cancel_at_period_end,
				canceledAt: _subscription.canceled_at
					? toDateTime(_subscription.canceled_at)
					: null,
				currentPeriodStart: toDateTime(_subscription.current_period_start),
				currentPeriodEnd: toDateTime(_subscription.current_period_end),
				createdAt: toDateTime(_subscription.created),
				endedAt: _subscription.ended_at
					? toDateTime(_subscription.ended_at)
					: null,
				trialStart: _subscription.trial_start
					? toDateTime(_subscription.trial_start)
					: null,
				trialEnd: _subscription.trial_end
					? toDateTime(_subscription.trial_end)
					: null,
				metadata: _subscription.metadata,
				status: _subscription.status
			}
		});
	const subscriptionTier = await handleSubscriptionStatus(_subscription);

	const [newUser] = await db
		.update(user)
		.set({ role: subscriptionTier })
		.where(eq(user.id, _user.id))
		.returning();

	console.log(
		`Upserted ${newUser.username}'s subscription to ${newUser.role} TIER`
	);
}

export async function deleteSubscription(
	subscriptionId: string,
	stripeUserId: string
) {
	const _user = await db.query.user.findFirst({
		where: eq(user.stripeId, stripeUserId)
	});

	if (!_user) throw new Error('no user found with the provided stripe id');

	const _subscription = await stripe.subscriptions.retrieve(subscriptionId, {
		expand: ['default_payment_method', 'plan']
	});

	const [deletedSub] = await db
		.delete(subscription)
		.where(eq(subscription.stripeSubId, _subscription.id))
		.returning();

	console.log(
		`Delete subscription [${_subscription.id}] for user [${deletedSub.userId}]`
	);
}
