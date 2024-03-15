import { getPost } from '$lib/utils/posts/posts';

export async function load({ params, parent }) {
	await parent();
	return await getPost(params.post);
}
