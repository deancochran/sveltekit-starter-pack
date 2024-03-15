import { getPosts } from '$lib/utils/posts/posts';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	try {
		const posts = await getPosts();
		return json(posts);
	} catch (e) {
		error(400, { code: '400', message: 'failed to fetch posts' });
	}
}
