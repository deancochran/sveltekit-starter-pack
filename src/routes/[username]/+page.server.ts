import { FriendshipStatus, type Friendship } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { error, fail, type Actions } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();
	if (!data.user) {
		error(404, {
			message: 'User not logged in',
			code: '404'
		});
	}

	const profile_user = await prisma.user.findUnique({
		where: { username: params.username },
		select: {
			id: true,
			role: true,
			bike_ftp: true,
			run_ftp: true,
			swim_ftp: true,
			max_hr: true,
			activities: true,
			username: true,
			created_at: true,
			private: true,
			training_sessions: true,
			avatar_file_id: true,
			banner_file_id: true,
			addressed_friendships: {
				where: {
					requester_id: data.user.id
				}
			},
			requested_friendships: {
				where: {
					addressee_id: data.user.id
				}
			},
			club_memberships: {
				include: {
					club: true
				}
			}
		}
	});

	if (!profile_user) {
		error(404, {
			message: 'User not found',
			code: '404'
		});
	}
	let addressed_friendship: Friendship | undefined = undefined;
	let can_view = false;
	let can_edit = false;
	if (data.user?.id) {
		if (data.user.id === profile_user.id) {
			can_edit = true;
			can_view = true;
		} else {
			addressed_friendship = profile_user.addressed_friendships.at(0);
			if (addressed_friendship && addressed_friendship.status === FriendshipStatus.ACCEPTED) {
				can_view = true;
			}
		}
	}

	return {
		profile_user,
		can_view,
		can_edit,
		addressed_friendship,
		requested_friendship: profile_user.requested_friendships.at(0) ?? undefined,
		...data
	};
};

export const actions: Actions = {
	decline: async (event) => {
		const { locals, params } = event;
		let t: ToastSettings;
		try {
			if (!locals.user) return fail(400);
			if (locals.user.username == params.username) return fail(400);
			const profile_user = await prisma.user.findFirstOrThrow({
				where: { username: params.username },
				include: {
					requested_friendships: {
						where: {
							addressee_id: locals.user.id
						}
					}
				}
			});
			if (profile_user.requested_friendships.length > 1) return fail(409);
			let friendship = profile_user.requested_friendships.at(0);
			if (!friendship) return fail(409);
			if (friendship.status != FriendshipStatus.REQUESTED) return fail(409);

			friendship = await prisma.friendship.update({
				data: {
					status: FriendshipStatus.DECLINED
				},
				where: {
					friendship_id: {
						addressee_id: locals.user.id,
						requester_id: profile_user.id
					}
				}
			});
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
			if (locals.user.username == params.username) return fail(400);
			const profile_user = await prisma.user.findFirstOrThrow({
				where: { username: params.username },
				include: {
					requested_friendships: {
						where: {
							addressee_id: locals.user.id
						}
					}
				}
			});
			if (profile_user.requested_friendships.length > 1) return fail(409);
			let friendship = profile_user.requested_friendships.at(0);
			if (!friendship) return fail(409);
			if (friendship.status != FriendshipStatus.REQUESTED) return fail(409);

			friendship = await prisma.friendship.update({
				data: {
					status: FriendshipStatus.ACCEPTED
				},
				where: {
					friendship_id: {
						addressee_id: locals.user.id,
						requester_id: profile_user.id
					}
				}
			});
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
			if (locals.user.username == params.username) return fail(400);
			const profile_user = await prisma.user.findFirstOrThrow({
				where: { username: params.username }
			});
			let friendship: Friendship;
			if (profile_user.private) {
				friendship = await prisma.friendship.upsert({
					create: {
						requester_id: locals.user.id,
						addressee_id: profile_user.id,
						status: FriendshipStatus.REQUESTED
					},
					update: {
						status: FriendshipStatus.REQUESTED
					},
					where: {
						friendship_id: {
							requester_id: locals.user.id,
							addressee_id: profile_user.id
						}
					}
				});
			} else {
				friendship = await prisma.friendship.upsert({
					create: {
						requester_id: locals.user.id,
						addressee_id: profile_user.id,
						status: FriendshipStatus.ACCEPTED
					},
					update: {
						status: FriendshipStatus.ACCEPTED
					},
					where: {
						friendship_id: {
							requester_id: locals.user.id,
							addressee_id: profile_user.id
						}
					}
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
			if (locals.user.username == params.username) return fail(400);
			const profile_user = await prisma.user.findFirstOrThrow({
				where: { username: params.username }
			});
			await prisma.friendship.delete({
				where: {
					friendship_id: {
						requester_id: locals.user.id,
						addressee_id: profile_user.id
					}
				}
			});
		} catch (e) {
			t = {
				message: 'Failed to remove friendship',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	}
};
