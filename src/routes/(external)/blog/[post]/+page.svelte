<script lang="ts">
	import { formatDate } from '$lib/utils/datetime';
	import { Avatar } from '@skeletonlabs/skeleton';
	export let data;
</script>

<div class="max-w-5xl mx-auto p-4 md:p-12 space-y-8">
	<ol class="breadcrumb">
		<li class="crumb"><a class="anchor" href="/blog">Blog</a></li>
		<li class="crumb-separator" aria-hidden>&rsaquo;</li>
		<li>{data.post.title}</li>
	</ol>
	<header class="space-y-4">
		<h1 class="h1">{data.post.title}</h1>
		<div class=" variant-glass-surface p-4 flex items-center align-middle justify-between">
			<span class="flex flex-row items-center align-middle just-start gap-1">
				<Avatar width="w-10" initials="DC" />
				<div class="flex flex-col items-start align-middle just-start">
					{data.post.author}
					<p class=" text-sm">Published at {formatDate(data.post.date)}</p>
				</div></span
			>
			<div class="flex tags">
				{#each data.post.categories as category}
					<span class="surface-4">&num;{category}</span>
				{/each}
			</div>
		</div>
	</header>

	<main>
		<article class="post">
			{@html data.content}
		</article>
	</main>
	<footer class="card p-4 variant-glass-surface flex justify-between items-center mb-28">
		<!-- Tags -->
		Fin.
		<!-- <div class="flex items-center space-x-4">
			{#each data.post.categories as tag}
				<span class="text-sm font-bold opacity-50 capitalize">{tag}</span>
			{/each}
		</div> -->
	</footer>
</div>
