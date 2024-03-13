import { getPosts } from '@lib/utils/posts/posts';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	try {
		const posts = await getPosts();
		return json(posts);
	} catch (e) {
		error(404, 'Failed to load posts');
	}
}
