<script lang="ts">
	import { createPostsIndex, searchPostsIndex, type PostSearchView } from '$lib/utils/posts/search';
	import { onMount } from 'svelte';

	let search: 'loading' | 'ready' = 'loading';
	$: searchTerm = '';
	export let results: PostSearchView[] = [];

	onMount(async () => {
		const posts = await fetch('/api/posts/search').then((res) => res.json());
		createPostsIndex(posts);
		search = 'ready';
	});

	$: if (search === 'ready') {
		results = searchPostsIndex(searchTerm);
	}
</script>

{#if search === 'ready'}
	<div class="search">
		<input
			bind:value={searchTerm}
			placeholder="Search"
			autocomplete="off"
			spellcheck="false"
			type="search"
		/>
	</div>
{/if}
