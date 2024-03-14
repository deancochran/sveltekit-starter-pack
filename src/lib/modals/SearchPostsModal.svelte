<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import SearchWorker from '$lib/utils/posts/search-worker?worker';
	import { onMount } from 'svelte';
	import type { ContentType } from '$lib/utils/posts/types';
	import Link from '$lib/components/Link.svelte';

	const modal = getModalStore();

	onMount(() => {
		searchWorker = new SearchWorker();
		// listen for messages
		searchWorker.addEventListener('message', (e) => {
			const { type, payload } = e.data;
			type === 'ready' && (search = 'ready') && (results = payload.results);
			type === 'results' && (results = payload.results);
		});
		// initialize when the component mounts
		searchWorker.postMessage({ type: 'load' });
		searchInput?.focus();
	});

	// Vite has a special import for workers

	let search: 'idle' | 'load' | 'ready' = 'idle';
	let searchTerm = '';
	$: results = [] as ContentType[];
	let searchWorker: Worker;
	let searchInput: HTMLInputElement;

	onNavigate(() => {
		modal.close();
	});

	$: if (search === 'ready' && searchTerm !== '') {
		searchWorker.postMessage({ type: 'search', payload: { searchTerm } });
	}

	$: if (searchTerm && !modal) {
		searchTerm = '';
	}
</script>

<div class="w-screen h-screen p-[10vh] flex items-start align-middle justify-center">
	<div class="card w-[40vw] max-w-[40vw] overflow-hidden">
		<header class="card-header flex justify-center">
			<input
				class="w-full"
				bind:value={searchTerm}
				placeholder="Search"
				autocomplete="off"
				spellcheck="false"
				type="search"
			/>
		</header>
		<section class="p-4 w-full h-[40vh] max-h-[40vh] overflow-y-scroll">
			<ul>
				{#each results as obj}
					<Link
						label={obj.post.title}
						type="btn"
						class="w-full flex-col items-start rounded-none border-2 border-primary-500  overflow-hidden p-2"
						href="/blog/{obj.post.slug}"
					>
						<h1 class=" font-semibold h3">{@html obj.post.title}</h1>
						<span class="!m-0 py-2"
							>{#each obj.post.categories as category}
								<span class="badge variant-filled">{category}</span>
							{/each}</span
						>
						<span class="!m-0">{obj.post.description}</span>
					</Link>
				{/each}
			</ul>
		</section>
	</div>
</div>
