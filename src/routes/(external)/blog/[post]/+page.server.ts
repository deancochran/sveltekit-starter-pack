import { getPost } from '$lib/utils/posts/utils.js';

export async function load({ params }) {
	const post = await getPost(params.post);
	return post;
}
