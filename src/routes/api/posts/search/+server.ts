import { getDeatilPosts } from '$lib/utils/posts/utils'
import { json } from '@sveltejs/kit'


export async function GET() {
	const posts = await getDeatilPosts()
	return json(posts)
}

export const prerender = true