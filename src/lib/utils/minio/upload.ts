import { minioClient } from '$lib/server/minio';
import { error } from 'console';
import type { UploadedObjectInfo } from 'minio';

export const PROFILE_PICTURE_BUCKET = 'cadence-profile-pictures';
async function uploadImage(
	bucketName: string,
	objectName: string,
	image_file: File
): Promise<UploadedObjectInfo | undefined> {
	try {
		// Check if the bucket exists, if not, create it
		const exists = await minioClient.bucketExists(bucketName);
		if (!exists) {
			await minioClient.makeBucket(bucketName, 'us-east-1');
		}
		const imageDataBuffer = Buffer.from(await image_file.arrayBuffer());
		// Upload the image to MinIO
		return await minioClient.putObject(bucketName, objectName, imageDataBuffer, {
			'Content-Type': 'image/jpeg' // Set the appropriate content type
		});
	} catch (error) {
		console.error('Error uploading image:', error);
	}
}

async function removeImage(
	bucketName: string,
	objectName: string,
	versionId: string | undefined = undefined
): Promise<void> {
	try {
		// Check if the bucket exists, if not, create it
		const exists = await minioClient.bucketExists(bucketName);
		if (!exists) {
			error('No Bucket Found', 404);
		}
		// Upload the image to MinIO
		await minioClient.removeObject(bucketName, objectName, { versionId });
	} catch (error) {
		console.error('Error uploading image:', error);
	}
}

async function getImage(
	bucketName: string,
	objectName: string,
): Promise<string> {
	// Check if the bucket exists, if not, create it
	const exists = await minioClient.bucketExists(bucketName);
	if (!exists) {
		error('No Bucket Found', 404);
	}
	// Upload the image to MinIO
	return await minioClient.presignedGetObject(bucketName, objectName);
}

export async function uploadProfilePicture(
	user_id: string,
	image_file: File
): Promise<UploadedObjectInfo | undefined> {
	return await uploadImage(PROFILE_PICTURE_BUCKET, user_id, image_file);
}

export async function removeProfilePicture(user_id: string): Promise<void> {
	await removeImage(PROFILE_PICTURE_BUCKET, user_id);
}

export async function getPresignedProfilePictureURL(user_id: string): Promise<string> {
	return await getImage(PROFILE_PICTURE_BUCKET, user_id);
}
