import { acceptClubMember, newClubSchema, newImageSchema } from '$lib/schemas';
import { db } from '$lib/drizzle/client';
import { club, clubEvent, clubMember, user } from '$lib/drizzle/schema';
import { lucia } from '$lib/server/lucia';
import { authAction, type AuthAction } from '$lib/server/utils';
import { PICTURE_BUCKET, uploadImage } from '$lib/utils/minio/helpers';
import type { PageServerLoad } from './$types';

import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail, type Actions, type RequestEvent } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { and, eq, gte } from 'drizzle-orm';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	const upcomingEvents = await db.query.clubEvent.findMany({
		where: and(
			eq(clubEvent.id, data.club.id),
			gte(clubEvent.date, dayjs().toDate())
		)
	});
	//TODO: leaking user info here
	const members = await db.query.clubMember.findMany({
		where: eq(clubMember.clubId, data.club.id),
		with: {
			user: true
		}
	});

	const adminForm = await superValidate(zod(acceptClubMember));

	return {
		...data,
		members,
		upcomingEvents,
		adminForm
	};
};

async function getAdmin(c: typeof club, u: typeof user) {
	return await db.query.clubMember.findFirst({
		where: and(
			eq(clubMember.clubId, c.id),
			eq(clubMember.userId, u.id),
			eq(clubMember.status, 'ACCEPTED'),
			eq(clubMember.admin, true)
		)
	});
}

function clubAdminAuthAction(
	action: AuthAction
): (event: RequestEvent) => Promise<any> {
	return authAction(async (event, auth) => {
		const _clubMember = await db.query.clubMember.findFirst({
			where: and(
				eq(clubMember.clubId, Number(event.params.clubId)),
				eq(clubMember.userId, auth.user.id)
			)
		});
		if (!_clubMember || !_clubMember.admin) {
			const t: ToastSettings = {
				message: 'User is not an Admin',
				background: 'variant-filled-warning'
			};
			redirect('/sign-in', t, event);
		}
		return await action(event, auth);
	});
}

export const actions: Actions = {
	UpdateClubAvatar: async (event) => {
		const sessionId = event.cookies.get(lucia.sessionCookieName);
		const { session, user } = await lucia.validateSession(sessionId ?? '');
		if (!session || !user) throw new Error('Bad Session or User');
		if (!(event.url instanceof URL)) throw new Error('Bad URL');
		const { request, params } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(newImageSchema));

		const image = formData.get('image');
		if (!(image instanceof File)) return fail(400, withFiles({ form }));
		try {
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('no club found');
			await db.transaction(async (tx) => {
				const { request, locals, params } = event;
				const formData = await request.formData();
				const form = await superValidate(formData, zod(newImageSchema));

				if (!form.valid || !locals.user || !Number(params.clubId)) {
					const t: ToastSettings = {
						message: 'Invalid Submission',
						background: 'variant-filled-warning'
					} as const;
					setFlash(t, event);
					return fail(400, withFiles({ form }));
				}
				const uuid = randomUUID();
				if (_club.avatarFileId) {
					await uploadImage(PICTURE_BUCKET, _club.avatarFileId, image);
				} else {
					await uploadImage(PICTURE_BUCKET, uuid, image);
				}
				await db
					.update(club)
					.set({ avatarFileId: _club.avatarFileId ?? uuid })
					.where(eq(club.id, _club.id));
			});
		} catch (error) {
			const t: ToastSettings = {
				message: 'Failed to update Profile Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
		const t: ToastSettings = {
			message: 'Updated Club Profile Picture',
			background: 'variant-filled-success'
		} as const;
		setFlash(t, event);
		return withFiles({ form });
	},
	updateClubAvatar: clubAdminAuthAction(async (event, _auth) => {
		const { request } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(newImageSchema));
		const image = formData.get('image');
		if (!(image instanceof File)) return fail(400, withFiles({ form }));
		try {
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(event.params.clubId))
			});
			if (!_club) throw new Error('no club found');
			await db.transaction(async (tx) => {
				if (!form.valid) {
					const t: ToastSettings = {
						message: 'Invalid Submission',
						background: 'variant-filled-warning'
					} as const;
					setFlash(t, event);
					return fail(400, withFiles({ form }));
				}
				const uuid = randomUUID();
				if (_club.avatarFileId) {
					await uploadImage(PICTURE_BUCKET, _club.avatarFileId, image);
				} else {
					await uploadImage(PICTURE_BUCKET, uuid, image);
				}
				await db
					.update(club)
					.set({ avatarFileId: _club.avatarFileId ?? uuid })
					.where(eq(club.id, _club.id));
			});
		} catch (error) {
			const t: ToastSettings = {
				message: 'Failed to update Profile Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
		const t: ToastSettings = {
			message: 'Updated Club Profile Picture',
			background: 'variant-filled-success'
		} as const;
		setFlash(t, event);
		return withFiles({ form });
	}),
	updateClubBanner: async (event) => {
		const { request, locals, params } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(newImageSchema));

		if (!form.valid || !locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}

		const image = formData.get('image');
		if (!(image instanceof File)) return fail(400, withFiles({ form }));
		try {
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('No club found');
			await db.transaction(async (ctx) => {
				const uuid = randomUUID();
				if (_club.bannerFileId) {
					await uploadImage(PICTURE_BUCKET, _club.bannerFileId, image);
				} else {
					await uploadImage(PICTURE_BUCKET, uuid, image);
				}

				await ctx
					.update(club)
					.set({
						bannerFileId: _club.bannerFileId ?? uuid
					})
					.where(eq(club.id, _club.id));
			});
		} catch (error) {
			const t: ToastSettings = {
				message: 'Failed to update Profile Banner Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
		const t: ToastSettings = {
			message: 'Updated Club Profile Banner Picture',
			background: 'variant-filled-success'
		} as const;
		setFlash(t, event);

		return withFiles({ form });
	},
	updateClub: async (event) => {
		const { request, params, locals } = event;
		const form = await superValidate(request, zod(newClubSchema));
		if (!form.valid || !locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			await db
				.update(club)
				.set({
					name: form.data.name,
					description: form.data.description,
					private: form.data.private
				})
				.where(eq(club.id, Number(params.clubId)));
		} catch (e) {
			t = {
				message: 'Failed to update club',
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
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('No Club Found');
			if (_club.private) {
				await db
					.insert(clubMember)
					.values({
						clubId: _club.id,
						userId: locals.user.id,
						status: 'REQUESTED',
						updatedAt: new Date()
					})
					.onConflictDoUpdate({
						target: [clubMember.userId, clubMember.clubId],
						set: {
							status: 'REQUESTED'
						}
					});
			} else {
				await db
					.insert(clubMember)
					.values({
						clubId: _club.id,
						userId: locals.user.id,
						status: 'ACCEPTED',
						updatedAt: new Date()
					})
					.onConflictDoUpdate({
						target: [clubMember.userId, clubMember.clubId],
						set: {
							status: 'ACCEPTED'
						}
					});
			}
		} catch (e) {
			t = {
				message: 'Failed to request membership',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},
	leave: async (event) => {
		const { locals, params } = event;
		let t: ToastSettings;
		try {
			if (!locals.user) return fail(400);
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId)),
				with: {
					clubMembers: true
				}
			});
			if (!_club) throw new Error('Club Not found');
			const admins = _club.clubMembers.filter((obj) => {
				return obj.admin;
			});
			if (admins.length == 1 && admins[0].userId == locals.user.id)
				throw new Error('You cannot leave as the last admin');
			await db
				.delete(clubMember)
				.where(
					and(
						eq(clubMember.userId, locals.user.id),
						eq(clubMember.clubId, _club.id)
					)
				);
		} catch (e) {
			if (!(e instanceof Error)) return fail(400);
			t = {
				message: e.message,
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},

	reject: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(acceptClubMember));
		if (!form.valid || !locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('No Club Found');
			await db
				.delete(clubMember)
				.where(
					and(
						eq(clubMember.userId, form.data.userId),
						eq(clubMember.clubId, _club.id)
					)
				);
			return { form };
		} catch (e) {
			t = {
				message: 'Failed to decline potential club member',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},
	accept: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(acceptClubMember));
		if (!form.valid || !locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('No Club Found');
			await db
				.update(clubMember)
				.set({
					status: 'ACCEPTED'
				})
				.where(
					and(
						eq(clubMember.userId, form.data.userId),
						eq(clubMember.clubId, _club.id)
					)
				);

			return { form };
		} catch (e) {
			t = {
				message: 'Failed to leave club',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},

	removeAdmin: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(acceptClubMember));
		if (!form.valid || !locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			if (form.data.userId == locals.user.id)
				throw new Error('You cannot remove yourself as an admin');

			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('No Club Found');

			await db
				.update(clubMember)
				.set({
					admin: false
				})
				.where(
					and(
						eq(clubMember.userId, form.data.userId),
						eq(clubMember.clubId, _club.id)
					)
				);

			return { form };
		} catch (e) {
			t = {
				message: 'Failed to add admin to club',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	},
	delete: async (event) => {
		const { locals, params } = event;
		if (!locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
		let t: ToastSettings;
		try {
			await db.delete(club).where(eq(club.id, Number(params.clubId)));
		} catch (e) {
			t = {
				message: 'Failed to delete club',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
		t = {
			message: 'Successfully deleted club',
			background: 'variant-filled-warning'
		} as const;
		redirect('/clubs', t, event);
	},
	addAdmin: async (event) => {
		const { locals, request, params } = event;
		const form = await superValidate(request, zod(acceptClubMember));
		if (!form.valid || !locals.user || !Number(params.clubId)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			const _club = await db.query.club.findFirst({
				where: eq(club.id, Number(params.clubId))
			});
			if (!_club) throw new Error('No Club Found');

			await db
				.update(clubMember)
				.set({
					admin: false
				})
				.where(
					and(
						eq(clubMember.userId, form.data.userId),
						eq(clubMember.clubId, _club.id)
					)
				);

			return { form };
		} catch (e) {
			t = {
				message: 'Failed to add admin to club',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
	}
};
