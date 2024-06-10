export type Categories = 'Changelog' | 'Guides' | 'Training' | 'Running' | "Feature";

export type Post = {
	categories: Categories[];
	author: string;
	slug: string;
	title: string;
	description: string;
	date: string;
	// categories: Categories[]
	published: boolean;
};
export type PostDetail = Post & {
	content: string;
};
export type ContentType = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	content: any;
	post: Post;
};

export type Result = {
	description: string[];
	slug: string;
	title: string;
};

export type SearchPostsResult = {
	slug: string;
	title: string;
	description: string;
	categories: Categories[];
	content: string[];
};

export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
