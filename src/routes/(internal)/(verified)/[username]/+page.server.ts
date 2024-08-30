import { consistencyChartSchema } from '$lib/schemas';
import { db } from '$lib/drizzle/client';
import { activities, friendship, user } from '$lib/drizzle/schema';
import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { and, asc, eq, gte, lte, type InferSelectModel } from 'drizzle-orm';
import { setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent, params, locals } = event;
	const data = await parent();

	if (!locals.user) {
		redirect(302, handleSignInRedirect(event));
	}
	const profileUser = await db.query.user.findFirst({
		where: eq(user.username, params['username']),
		with: {
			clubMembers: {
				with: {
					club: true
				}
			},
			friendships_addresseeId: {
				where: eq(friendship.requesterId, locals.user.id)
			},
			friendships_requesterId: {
				where: eq(friendship.addresseeId, locals.user.id)
			}
		}
	});

	if (!profileUser) {
		error(404, {
			message: 'User not found',
			code: '404'
		});
	}
	let addressedFriendship: InferSelectModel<typeof friendship> | undefined =
		undefined;
	let canView = false;
	let canEdit = false;

	if (locals.user.id === profileUser.id) {
		canEdit = true;
		canView = true;
	} else {
		addressedFriendship = profileUser.friendships_addresseeId.at(0);
		if (addressedFriendship && addressedFriendship.status === 'ACCEPTED') {
			canView = true;
		}
	}

	return {
		profileUser,
		canView,
		canEdit,
		addressedFriendship,
		requested_friendship:
			profileUser.friendships_requesterId.at(0) ?? undefined,
		...data
	};
};

export const actions: Actions = {
	consistency_chart: async (event) => {
		const { locals, request } = event;
		const form = await superValidate(request, zod(consistencyChartSchema));
		if (!form.valid || !locals.user) {
			return fail(400, { form });
		}
		try {
			const endDate = dayjs();
			const startDate = endDate.subtract(1, form.data.frequency);
			const usserActivities = await db.query.activities.findMany({
				where: and(
					gte(activities.date, startDate.toDate()),
					lte(activities.date, endDate.toDate()),
					eq(activities.userId, locals.user.id)
				),
				orderBy: [asc(activities.date)]
			});
			return { form, activities: usserActivities };
		} catch (e) {
			const t: ToastSettings = {
				message: 'Failed to update chart',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return fail(400, { form });
		}
	},
	decline: async (event) => {
		const { locals, params } = event;
		let t: ToastSettings;
		try {
			if (!locals.user) return fail(400);
			if (locals.user.username == params['username']) return fail(400);
			const profileUser = await db.query.user.findFirst({
				where: eq(user.username, params['username']!),
				with: {
					friendships_requesterId: {
						where: eq(friendship.addresseeId, locals.user.id)
					}
				}
			});
			if (!profileUser) throw new Error('No user found');
			if (profileUser.friendships_requesterId.length > 1) return fail(409);
			const sessionFriendship = profileUser.friendships_requesterId.at(0);
			if (!sessionFriendship) return fail(409);
			if (sessionFriendship.status != 'REQUESTED') return fail(409);

			await db
				.update(friendship)
				.set({
					status: 'DECLINED'
				})
				.where(
					and(
						eq(friendship.addresseeId, locals.user.id),
						eq(friendship.requesterId, profileUser.id)
					)
				);
		} catch (e) {
			t = {
				message: 'Failed to update friendship',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},
	accept: async (event) => {
		const { locals, params } = event;
		let t: ToastSettings;
		try {
			if (!locals.user) return fail(400);
			if (locals.user.username == params['username']) return fail(400);
			const profileUser = await db.query.user.findFirst({
				where: eq(user.username, params['username']!),
				with: {
					friendships_requesterId: {
						where: eq(friendship.addresseeId, locals.user.id)
					}
				}
			});
			if (!profileUser) throw new Error('No user found');
			if (profileUser.friendships_requesterId.length > 1) return fail(409);
			const sessionFriendship = profileUser.friendships_requesterId.at(0);
			if (!sessionFriendship) return fail(409);
			if (sessionFriendship.status != 'REQUESTED') return fail(409);
			await db
				.update(friendship)
				.set({
					status: 'ACCEPTED'
				})
				.where(
					and(
						eq(friendship.addresseeId, locals.user.id),
						eq(friendship.requesterId, profileUser.id)
					)
				);
		} catch (e) {
			t = {
				message: 'Failed to update friendship',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},
	request: async (event) => {
		const { locals, params } = event;
		let t: ToastSettings;
		try {
			if (!locals.user) return fail(400);
			if (locals.user.username == params['username']) return fail(400);
			const profileUser = await db.query.user.findFirst({
				where: eq(user.username, params['username']!)
			});
			if (!profileUser) throw new Error('No user found');

			if (profileUser.private) {
				await db
					.insert(friendship)
					.values({
						requesterId: locals.user.id,
						addresseeId: profileUser.id,
						updatedAt: new Date(),
						status: 'REQUESTED'
					})
					.onConflictDoUpdate({
						target: [friendship.requesterId, friendship.addresseeId],
						set: { status: 'REQUESTED' }
					});
			} else {
				await db
					.insert(friendship)
					.values({
						requesterId: locals.user.id,
						addresseeId: profileUser.id,
						updatedAt: new Date(),
						status: 'ACCEPTED'
					})
					.onConflictDoUpdate({
						target: [friendship.requesterId, friendship.addresseeId],
						set: { status: 'ACCEPTED' }
					});
			}
		} catch (e) {
			t = {
				message: 'Failed to update friendship',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},
	unfollow: async (event) => {
		const { locals, params } = event;
		let t: ToastSettings;
		try {
			if (!locals.user) return fail(400);
			if (locals.user.username == params['username']) return fail(400);
			const profileUser = await db.query.user.findFirst({
				where: eq(user.username, params['username']!)
			});
			if (!profileUser) throw new Error('No user found');
			await db
				.delete(friendship)
				.where(
					and(
						eq(friendship.requesterId, locals.user.id),
						eq(friendship.addresseeId, profileUser.id)
					)
				);
		} catch (e) {
			t = {
				message: 'Failed to remove friendship',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	}
};
