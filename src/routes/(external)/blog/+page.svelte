<script lang="ts">
	import { Rss } from 'lucide-svelte';
	export let data

</script>

<div class="page-container-wide page-padding">
	<header class="flex items-center align-middle justify-between p-4">
		<div class="space-y-4">
			<h2 class="h2">The Cadence Blog</h2>
			<p>Keep up with the latest news for Cadence.</p>
		</div>
		<!-- RSS Icon -->
		<a href="/rss" class="btn-icon btn-icon-md bg-primary-500/50">
			<Rss />
		</a>
	</header>
	<hr />
	<!-- Blog List -->
	<section class="blog-list space-y-8">
		{#each data.posts as post}
			<a
				class="block hover:card hover:variant-soft p-4 rounded-container-token"
				href="/blog/{post.slug}"
				data-sveltekit-preload-data="hover"
			>
				<article class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-8">
					<div class="space-y-4">
						<h1 class=" font-semibold h2">{post.title}</h1>
						<span class="py-2"
							>{#each post.categories as category}
								<span class="badge variant-filled">{category}</span>
							{/each}</span
						>
						<span>{post.description}</span>
						<button class="btn variant-ghost-surface">Read Article &rarr;</button>
					</div>
				</article>
			</a>
		{/each}
	</section>
	<hr />
</div>


