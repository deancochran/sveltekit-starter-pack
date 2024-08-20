// import Minio from "minio"
import { MINIO_ROOT_PASSWORD, MINIO_ROOT_USER } from '$env/static/private';
import * as Minio from 'minio';

export const minio = new Minio.Client({
	endPoint: 'localhost', // Minio server endpoint (change as needed)
	port: 9000, // Minio server port (change as needed)
	useSSL: false, // Disable SSL for local development
	accessKey: MINIO_ROOT_USER, // Your Minio access key
	secretKey: MINIO_ROOT_PASSWORD // Your Minio secret key
});
