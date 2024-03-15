import { createPostsIndex, searchPostsIndex } from './search';
import type { PostDetail } from './types';

// listen for messages
addEventListener('message', async (e) => {
	const { type, payload } = e.data;
	if (type === 'load') {
		// get the posts data
		const posts: PostDetail[] = await fetch('/api/posts/search').then((res) => res.json());
		// create search index
		createPostsIndex(posts);
		// we're in business 🤝
		postMessage({ type: 'ready' });
	}

	if (type === 'search') {
		// get search term
		const searchTerm = payload.searchTerm;
		// search posts index
		const results = searchPostsIndex(searchTerm);
		// send message with results and search term
		postMessage({ type: 'results', payload: { results, searchTerm } });
	}
});
