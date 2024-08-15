<script lang="ts">
	import { formatDate } from '$lib/utils/datetime';
	// import { Avatar } from '@skeletonlabs/skeleton';
	import { Calendar } from 'lucide-svelte';

	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.post}
	<div class="max-w-5xl mx-auto md:px-12">
		<ol class="breadcrumb">
			<li class="crumb"><a class="anchor" href="/blog">Blog</a></li>
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			<li>{data.post.title}</li>
		</ol>
		<header>
			<h1 class="h1 py-4">{data.post.title}</h1>

			<div
				class=" variant-soft-surface p-4 rounded-sm shadow-md flex flex-row gap-1 items-start align-middle justify-between"
			>
				<!-- <Avatar width="w-10" initials="DC" /> -->
				<!-- <p>Author: {data.post.author}</p> -->
				<p
					class="flex flex-row flex-nowrap gap-2 items-center align-middle justify-start line-clamp-1 text-nowrap overflow-visible"
				>
					<Calendar class="w-4 h-4 min-w-4 min-h-4" />
					{formatDate(data.post.date)}
				</p>
				<div
					class="w-fit flex flex-row items-end align-middle justify-end gap-1 flex-wrap overflow-clip"
				>
					{#each data.post.categories as category}
						<span class="chip variant-filled-surface">{category}</span>
					{/each}
				</div>
			</div>
		</header>

		<main class="py-4">
			<hr />
			<svelte:component this={data.content} />
			<hr />
		</main>

		<footer
			class=" variant-soft-surface p-4 rounded-sm shadow-md flex flex-row gap-1 items-start align-middle justify-between"
		>
			<!-- <Avatar width="w-10" initials="DC" /> -->
			<!-- <p>Author: {data.post.author}</p> -->
			<p
				class="flex flex-row flex-nowrap gap-2 items-center align-middle justify-start line-clamp-1 text-nowrap overflow-visible"
			>
				<Calendar class="w-4 h-4 min-w-4 min-h-4" />
				{formatDate(data.post.date)}
			</p>
			<div
				class="w-fit flex flex-row items-end align-middle justify-end gap-1 flex-wrap overflow-clip"
			>
				{#each data.post.categories as category}
					<span class="chip variant-filled-surface">{category}</span>
				{/each}
			</div>
		</footer>
	</div>
{/if}
