export type Categories = "Changelog"

export type ContentType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any
    post: Post
}

export type Post = {
	title: string
	slug: string
	description: string
	author: string
	date: string
	categories: Categories[]
	published: boolean
}


export type Result = {
	description: string[]
	slug: string
	title: string
}


export type Fetch = (
	input: RequestInfo | URL,
	init?: RequestInit
) => Promise<Response>
