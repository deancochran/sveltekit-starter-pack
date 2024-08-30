import { minio } from '$lib/server/minio';
import { PICTURE_BUCKET } from '$lib/utils/minio/helpers';

/** @type {import('./$types').RequestHandler} */
export async function GET(event: { params: { uuid: string } }) {
	const { params } = event;
	const image = await minio.getObject(PICTURE_BUCKET, params.uuid);
	return new Response(image as unknown as BodyInit);
}
