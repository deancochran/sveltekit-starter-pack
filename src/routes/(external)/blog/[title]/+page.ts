import type { ContentType, Post } from "$lib/utils/posts/types";
import { error } from "@sveltejs/kit";

export async function load({ params, parent }) {
	try {
		const data = await parent()
		const post = await import(`../../../../posts/${params.title}.md`);
		if(!post || !post.metadata) {
			throw new Error('post not found')
		}
		return {
			content:post.default,
			post:post.metadata as Post,
			...data
		} as ContentType;
	} catch (e) {
		error(404, {message: 'post not found', code:'404'})
	}
	
}