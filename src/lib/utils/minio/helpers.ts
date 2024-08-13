import { error } from 'console';
import { minio } from '$lib/server/minio';

export const PICTURE_BUCKET = 'cadence-pictures';

export async function uploadImage(bucketName: string, objectName: string, image_file: File) {
	try {
		// Check if the bucket exists, if not, create it
		const exists = await minio.bucketExists(bucketName);
		if (!exists) {
			await minio.makeBucket(bucketName, 'us-east-2');
		}
		const imageDataBuffer = Buffer.from(await image_file.arrayBuffer());
		// Upload the image to MinIO
		return await minio.putObject(bucketName, objectName, imageDataBuffer);
	} catch (error) {
		console.error('Error uploading image:', error);
	}
}

export async function removeImage(
	bucketName: string,
	objectName: string,
	versionId: string | undefined = undefined
): Promise<void> {
	try {
		// Check if the bucket exists, if not, create it
		const exists = await minio.bucketExists(bucketName);
		if (!exists) {
			error('No Bucket Found', 404);
		}
		// Upload the image to MinIO
		await minio.removeObject(bucketName, objectName, { versionId });
	} catch (error) {
		console.error('Error uploading image:', error);
	}
}

export async function getImage(bucketName: string, objectName: string) {
	// Check if the bucket exists, if not, create it
	return await minio.getObject(bucketName, objectName);
}
