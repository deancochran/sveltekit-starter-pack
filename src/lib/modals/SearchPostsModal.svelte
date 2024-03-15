<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import SearchWorker from '$lib/utils/posts/search-worker?worker';
	import { onMount } from 'svelte';
	import type { SearchPostsResult } from '$lib/utils/posts/types';
	import Link from '$lib/components/Link.svelte';
	import ThemeSelector from '$lib/components/ThemeSelector.svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { mainNav } from '$lib/constants';
	import Icon from '$lib/components/Icon.svelte';
	import { fly, slide } from 'svelte/transition';

	const modal = getModalStore();

	onMount(() => {
		searchWorker = new SearchWorker();
		// listen for messages
		searchWorker.addEventListener('message', (e) => {
			const { type, payload } = e.data;
			type === 'ready' && (search = 'ready');
			type === 'results' && (results = payload.results);
		});
		// initialize when the component mounts
		searchWorker.postMessage({ type: 'load' });
		searchInput?.focus();
	});

	// Vite has a special import for workers

	let search: 'idle' | 'load' | 'ready' = 'idle';
	let searchTerm = '';
	$: results = [] as SearchPostsResult[];
	let searchWorker: Worker;
	let searchInput: HTMLInputElement;

	onNavigate(() => {
		modal.close();
	});

	$: if (search === 'ready') {
		searchWorker.postMessage({ type: 'search', payload: { searchTerm } });
	}

	$: if (searchTerm && !modal) {
		searchTerm = '';
	}
</script>

<div class="flex items-start align-middle justify-center">
	<div class="card -mt-[20vh] w-[80vh] max-w-[90vw] overflow-hidden">
		<header class="card-header flex justify-center">
			<input
				class="w-full text-base text-surface-500"
				bind:value={searchTerm}
				placeholder="Search"
				autocomplete="off"
				spellcheck="false"
				type="search"
			/>
		</header>
		<section class="px-4 w-full h-[40vh] max-h-[40vh] overflow-y-scroll hide-scrollbar py-2">
			{#if results}
				{#each results as obj}
					<a
						in:slide
						out:slide
						type="btn"
						class="btn bg-surface-backdrop-token blur-none w-full flex-col items-start rounded-none overflow-hidden scale-100 active:scale-100"
						href="/blog/{obj.slug}"
					>
						<h1 class=" font-semibold h3">{@html obj.title}</h1>
						<span class="!m-0 py-2"
							>{#each obj.categories as category}
								<span class="badge variant-filled">{category}</span>
							{/each}</span
						>
						<span class="!m-0">{@html obj.description}</span>
						<span class="!m-0">{@html obj.content}</span>
					</a>
				{/each}
			{/if}
			{#each mainNav as nav}
				{#if !nav.requires_account}
					<Link
						label={nav.title}
						type="btn"
						class="btn bg-surface-backdrop-token w-full justify-start rounded-none overflow-hidden scale-100 active:scale-100"
						href={nav.href}
					>
						<span><Icon icon_name={nav.icon_name} /></span>
						<span>{nav.title}</span>
					</Link>
				{/if}
			{/each}
		</section>
		<div
			class="hidden sm:flex flex-row items-center align-middle justify-between p-4 shadow-2xl shadow-surface-900"
		>
			<div class="flex flex-row">
				<h1 class="h1 font-serif bg-op font-bold text-4xl">
					<span class="text-surface">cadence</span>
				</h1>
			</div>
			<div class="flex flex-row">
				<Link
					label={'Buy Me a Coffee'}
					type="btn-icon"
					href="https://www.buymeacoffee.com/deancochran"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						class="fill-current"
						><path
							d="m20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379c-.197-.069-.42-.098-.57-.241c-.152-.143-.196-.366-.231-.572c-.065-.378-.125-.756-.192-1.133c-.057-.325-.102-.69-.25-.987c-.195-.4-.597-.634-.996-.788a5.723 5.723 0 0 0-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 0 0-3.7.062c-.915.083-1.88.184-2.75.5c-.318.116-.646.256-.888.501c-.297.302-.393.77-.177 1.146c.154.267.415.456.692.58c.36.162.737.284 1.123.366c1.075.238 2.189.331 3.287.37c1.218.05 2.437.01 3.65-.118c.299-.033.598-.073.896-.119c.352-.054.578-.513.474-.834c-.124-.383-.457-.531-.834-.473c-.466.074-.96.108-1.382.146c-1.177.08-2.358.082-3.536.006a22.228 22.228 0 0 1-1.157-.107c-.086-.01-.18-.025-.258-.036c-.243-.036-.484-.08-.724-.13c-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 0 1 3.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145c.392.085.895.113 1.07.542c.055.137.08.288.111.431l.319 1.484a.237.237 0 0 1-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 0 1-4.743.295a37.059 37.059 0 0 1-4.699-.304c-.14-.017-.293-.042-.417-.06c-.326-.048-.649-.108-.973-.161c-.393-.065-.768-.032-1.123.161c-.29.16-.527.404-.675.701c-.154.316-.199.66-.267 1c-.069.34-.176.707-.135 1.056c.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0 0 11.343.376a.483.483 0 0 1 .535.53l-.071.697l-1.018 9.907c-.041.41-.047.832-.125 1.237c-.122.637-.553 1.028-1.182 1.171c-.577.131-1.165.2-1.756.205c-.656.004-1.31-.025-1.966-.022c-.699.004-1.556-.06-2.095-.58c-.475-.458-.54-1.174-.605-1.793l-.731-7.013l-.322-3.094c-.037-.351-.286-.695-.678-.678c-.336.015-.718.3-.678.679l.228 2.185l.949 9.112c.147 1.344 1.174 2.068 2.446 2.272c.742.12 1.503.144 2.257.156c.966.016 1.942.053 2.892-.122c1.408-.258 2.465-1.198 2.616-2.657c.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 0 1 .39-.426c.402-.078.787-.212 1.074-.518c.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233c-2.416.359-4.866.54-7.308.46c-1.748-.06-3.477-.254-5.207-.498c-.17-.024-.353-.055-.47-.18c-.22-.236-.111-.71-.054-.995c.052-.26.152-.609.463-.646c.484-.057 1.046.148 1.526.22c.577.088 1.156.159 1.737.212c2.48.226 5.002.19 7.472-.14c.45-.06.899-.13 1.345-.21c.399-.072.84-.206 1.08.206c.166.281.188.657.162.974a.544.544 0 0 1-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 0 1-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38c0 0 1.243.065 1.658.065c.447 0 1.786-.065 1.786-.065c.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 0 0-1.322-.238c-.826 0-1.491.284-2.26.613z"
						/></svg
					>
				</Link>
				<div class="flex px-2 items-center justify-center align-middle">
					<LightSwitch />
				</div>
				<div class="flex px-2 items-center justify-center align-middle">
					<ThemeSelector />
				</div>
			</div>
		</div>
	</div>
</div>
