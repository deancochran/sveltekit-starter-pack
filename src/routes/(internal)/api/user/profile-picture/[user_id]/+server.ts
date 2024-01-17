import { prisma } from '$lib/server/prisma';
import { getPresignedProfilePictureURL } from '$lib/utils/minio/upload';
import { json } from '@sveltejs/kit';


export async function GET(event) {
	const { params } = event;
	const { user_id } = params;

	const user = await prisma.user.findUniqueOrThrow({ where: { id: user_id } });
	try {
		const presignedUrl = await getPresignedProfilePictureURL(user.id);
		return json({ presignedUrl }, { status: 200 });
	} catch (error) {
		return json({ "message": "Error generating presigned URL" }, { status: 400 });
	}
}


