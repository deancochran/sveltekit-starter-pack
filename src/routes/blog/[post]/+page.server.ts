import type { Post } from '@lib/utils/posts/posts.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const post = await import(`../../../posts/${params.post}.md`);
		return {
			html: await post.default.$$render(),
			meta: post.metadata as Post
		};
	} catch (e) {
		error(404, `Could not find ${params.post}`);
	}
}
