import { accept_club_member, new_club_schema, new_image_schema } from '$lib/schemas';
import { uploadImage, PICTURE_BUCKET } from '$lib/utils/minio/helpers';
import type { PageServerLoad } from './$types';

import { FriendshipStatus, type club_event, type club_member, type file } from '@prisma/client';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { fail, type Actions } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	const upcoming_events = await prisma.club_event.findMany({
		where: {
			club_id: data.club.id,
			date: {
				gte: dayjs().toDate()
			}
		},
		take: 3
	});
	const members = await prisma.club_member.findMany({
		where: {
			club_id: data.club.id
		},
		include: {
			user: {
				select: {
					username: true,
					email: true,
					role: true,
					avatar_file_id: true
				}
			}
		}
	});

	const admin_form = await superValidate(zod(accept_club_member));

	return {
		...data,
		members,
		upcoming_events,
		admin_form
	};
};

export const actions: Actions = {
	updateClubAvatar: async (event) => {
		const { request, locals, params } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(new_image_schema));

		if (!form.valid || !locals.user || !Number(params.club_id)) {
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
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			await prisma.$transaction(async (db) => {
				let new_file: file;
				if (club?.avatar_file_id) {
					await uploadImage(PICTURE_BUCKET, club.avatar_file_id, image);
					new_file = await db.file.update({
						where: {
							id: club.avatar_file_id
						},
						data: {
							name: image.name,
							type: image.type,
							size: image.size
						}
					});
				} else {
					const uuid = randomUUID();
					await uploadImage(PICTURE_BUCKET, uuid, image);
					new_file = await db.file.create({
						data: {
							id: uuid,
							bucket: PICTURE_BUCKET,
							name: image.name,
							type: image.type,
							size: image.size
						}
					});
				}

				await db.club.update({
					where: {
						id: club.id
					},
					data: {
						avatar_file_id: new_file.id
					}
				});
				return new_file;
			});
		} catch (error) {
			let t: ToastSettings = {
				message: 'Failed to update Profile Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
		let t: ToastSettings = {
			message: 'Updated Club Profile Picture',
			background: 'variant-filled-success'
		} as const;
		setFlash(t, event);

		return withFiles({ form });
	},
	updateClubBanner: async (event) => {
		const { request, locals, params } = event;
		const formData = await request.formData();
		const form = await superValidate(formData, zod(new_image_schema));

		if (!form.valid || !locals.user || !Number(params.club_id)) {
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
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			await prisma.$transaction(async (db) => {
				let new_file: file;
				if (club.banner_file_id) {
					await uploadImage(PICTURE_BUCKET, club.banner_file_id, image);
					new_file = await db.file.update({
						where: {
							id: club.banner_file_id
						},
						data: {
							name: image.name,
							type: image.type,
							size: image.size
						}
					});
				} else {
					const uuid = randomUUID();
					await uploadImage(PICTURE_BUCKET, uuid, image);
					new_file = await db.file.create({
						data: {
							id: uuid,
							bucket: PICTURE_BUCKET,
							name: image.name,
							type: image.type,
							size: image.size
						}
					});
				}

				await db.club.update({
					where: {
						id: club.id
					},
					data: {
						banner_file_id: new_file.id
					}
				});
				return new_file;
			});
		} catch (error) {
			let t: ToastSettings = {
				message: 'Failed to update Profile Banner Picture',
				background: 'variant-filled-error'
			} as const;
			setFlash(t, event);
			return fail(400, withFiles({ form }));
		}
		let t: ToastSettings = {
			message: 'Updated Club Profile Banner Picture',
			background: 'variant-filled-success'
		} as const;
		setFlash(t, event);

		return withFiles({ form });
	},
	updateClub: async (event) => {
		const { request, params, locals } = event;
		const form = await superValidate(request, zod(new_club_schema));
		if (!form.valid || !locals.user || !Number(params.club_id)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			await prisma.club.update({
				where: {
					id: Number(params.club_id)
				},
				data: {
					name: form.data.name,
					description: form.data.description,
					private: form.data.private
				}
			});
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
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			let club_member: club_member;
			if (club.private) {
				club_member = await prisma.club_member.upsert({
					create: {
						club_id: club.id,
						user_id: locals.user.id,
						status: FriendshipStatus.REQUESTED
					},
					update: {
						status: FriendshipStatus.REQUESTED
					},
					where: {
						club_member_id: {
							user_id: locals.user.id,
							club_id: club.id
						}
					}
				});
			} else {
				club_member = await prisma.club_member.upsert({
					create: {
						club_id: club.id,
						user_id: locals.user.id,
						status: FriendshipStatus.ACCEPTED
					},
					update: {
						status: FriendshipStatus.ACCEPTED
					},
					where: {
						club_member_id: {
							user_id: locals.user.id,
							club_id: club.id
						}
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
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) },
				include: {
					members: {
						where: {
							admin: true,
							status: FriendshipStatus.ACCEPTED
						}
					}
				}
			});
			if (club.members.length == 1 && club.members[0].user_id == locals.user.id)
				throw new Error('You cannot leave as the last admin');

			await prisma.club_member.delete({
				where: {
					club_member_id: {
						user_id: locals.user.id,
						club_id: club.id
					}
				}
			});
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
		const form = await superValidate(request, zod(accept_club_member));
		if (!form.valid || !locals.user || !Number(params.club_id)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			await prisma.club_member.delete({
				where: {
					club_member_id: {
						user_id: form.data.user_id,
						club_id: club.id
					}
				}
			});
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
		const form = await superValidate(request, zod(accept_club_member));
		if (!form.valid || !locals.user || !Number(params.club_id)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			await prisma.club_member.update({
				data: {
					status: FriendshipStatus.ACCEPTED
				},
				where: {
					club_member_id: {
						user_id: form.data.user_id,
						club_id: club.id
					}
				}
			});
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
		const form = await superValidate(request, zod(accept_club_member));
		if (!form.valid || !locals.user || !Number(params.club_id)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			if (form.data.user_id == locals.user.id)
				throw new Error('You cannot remove yourself as an admin');
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			await prisma.club_member.update({
				data: {
					admin: false
				},
				where: {
					club_member_id: {
						user_id: form.data.user_id,
						club_id: club.id
					}
				}
			});
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
		const { locals, request, params } = event;
		if (!locals.user || !Number(params.club_id)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
		}
		let t: ToastSettings;
		try {
			await prisma.club.delete({
				where: { id: Number(params.club_id) }
			});
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
		const form = await superValidate(request, zod(accept_club_member));
		if (!form.valid || !locals.user || !Number(params.club_id)) {
			const t: ToastSettings = {
				message: 'Invalid Submission',
				background: 'variant-filled-warning'
			} as const;
			setFlash(t, event);
			return { form };
		}
		let t: ToastSettings;
		try {
			const club = await prisma.club.findFirstOrThrow({
				where: { id: Number(params.club_id) }
			});
			await prisma.club_member.update({
				data: {
					admin: true
				},
				where: {
					club_member_id: {
						user_id: form.data.user_id,
						club_id: club.id
					}
				}
			});
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
