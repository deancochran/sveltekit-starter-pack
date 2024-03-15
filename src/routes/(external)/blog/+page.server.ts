import type { Post } from "$lib/utils/posts/types";

export async function load({ fetch, parent }) {
	await parent()
	const response = await fetch('api/posts');
	if (!response.ok) throw new Error(`Error fetching JSON from ${response.url}`);
	const posts: Post[] = await response.json();
	const publishedPosts = posts.filter(({ published }) => published);
	return { posts: publishedPosts };
}
