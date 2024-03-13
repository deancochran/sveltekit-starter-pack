<script lang="ts">
	import Badge from '@lib/components/ui/badge/badge.svelte';
	import { formatDate } from '@lib/utils/datetime/format.js';
	export let data;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="post w-[90vw] sm:w-[60vw]">
	<h1>{data.meta.title}</h1>
	<p>{data.meta.description}</p>
	<p>Published at {formatDate(data.meta.date)}</p>
	<!-- <div class="flex flex-row gap-1">
		{#each data.meta.categories as category}
			<Badge>{category}</Badge>
		{/each}
	</div> -->
		{@html data.html}
</article>
