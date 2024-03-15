import FlexSearch from 'flexsearch';
import type { PostDetail, SearchPostsResult } from './types';

export let postsIndex: FlexSearch.Index;
export let posts: PostDetail[];

export function createPostsIndex(data: PostDetail[]) {
	// create the posts index
	postsIndex = new FlexSearch.Index({ tokenize: 'forward' });
	data.forEach((post, i) => {
		// index the title and content together
		const item = `${post.title} ${post.description} ${post.date} ${post.content}`;
		// add the item to the index 👍️
		postsIndex.add(i, item);
	});

	posts = data;
}

export function searchPostsIndex(searchTerm: string):SearchPostsResult[] {
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const results = postsIndex.search(match);
	return results
		.map((index) => posts[index as number])
		.map(({ slug, title, categories, description, content }) => {
			return {
				slug,
				title: replaceTextWithMarker(title, match),
				description: replaceTextWithMarker(description, match),
				categories,
				content: getMatches(content, match)
			};
		});
}

function replaceTextWithMarker(text: string, match: string) {
	const regex = new RegExp(match, 'gi');
	return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}

function getMatches(text: string, searchTerm: string, limit = 1) {
	const regex = new RegExp(searchTerm, 'gi');
	const indexes = [];
	let matches = 0;
	let match;

	while ((match = regex.exec(text)) !== null && matches < limit) {
		indexes.push(match.index);
		matches++;
	}

	return indexes.map((index) => {
		const start = index - 20;
		const end = index + 80;
		const excerpt = text.substring(start, end).trim();
		return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
	});
}
