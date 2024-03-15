import FlexSearch from 'flexsearch';
import type { ContentType } from './types';

let postsIndex: FlexSearch.Index;
export let posts: ContentType[];

export function createPostsIndex(data: ContentType[]): ContentType[] {
	// create the posts index
	postsIndex = new FlexSearch.Index({ tokenize: 'forward' });
	data.forEach(async (obj, i) => {
		// index the title and content together
		// const p = await import(`../../../../posts/${post.slug}.md`)
		const item = `${obj.post.title} ${obj.post.description} ${obj.post.slug} ${obj.post.categories} ${obj.content}`;
		// add the item to the index 👍️
		postsIndex.add(i, item);
	});
	posts = data;
	return posts;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMatches(text: string, searchTerm: string, limit = 1) {
	// create dynamic regex 😎
	const regex = new RegExp(searchTerm, 'gi');
	// word indexes
	const indexes = [];
	// matches count
	let matches = 0;
	// current match in loop
	let match;

	while ((match = regex.exec(text)) !== null && matches < limit) {
		// push that shit
		indexes.push(match.index);
		// increment matches
		matches++;
	}

	// take the word index...
	return indexes.map((index) => {
		// go back 20 characters
		const start = index - 20;
		// go forward 80 characters
		const end = index + 80;
		// yoink the text
		const excerpt = text.substring(start, end).trim();
		// return excerpt 🤝
		return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
	});
}

function replaceTextWithMarker(text: string, match: string) {
	// create dynamic regex 😎
	const regex = new RegExp(match, 'gi');
	// preserves the text casing 🤙
	return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}

export type PostSearchView = {
	slug: string;
	title: string;
	description: string;
	content: string[];
};

export function searchPostsIndex(searchTerm: string): PostSearchView[] {
	// escape special regex characters
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// return matching post indexes 💪
	const results = postsIndex.search(match);

	return (
		results
			.map((i) => posts[i as number])
			// filter the posts based on the matched index
			// you can do whatever you want at this point 👌
			.map((obj) => {
				return {
					slug: obj.post.slug,
					// replace match in title with a marker
					title: replaceTextWithMarker(obj.post.title, match),
					// match word`s in post and replace matches with marker
					description: replaceTextWithMarker(obj.post.description, match),
					// match words in post and replace matches with marker
					content: getMatches(obj.post.title, match)
				};
			}) as PostSearchView[]
	);
}
