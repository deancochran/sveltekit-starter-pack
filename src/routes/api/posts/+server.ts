import { getPosts } from '$lib/utils/posts/utils'
import { json } from '@sveltejs/kit'

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}