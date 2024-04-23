<script lang="ts">
	import { PlusSquare } from 'lucide-svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	
</script>

<div class="page-container-wide page-padding">
	<header class="flex items-center align-middle justify-between p-4">
		<div class="space-y-4">
			<h1 class="h1 font-semibold">{data.plan.name}: Training Sessions</h1>
		</div>
		<!-- Create New Icon-->
		<a href="/plans/{data.plan.id}/sessions/create" class="btn flex bg-primary-500/50 space-x-2">
			<p>Create Session</p>
			<PlusSquare />
		</a>
	</header>
	<!-- Session List -->
	<section class="blog-list space-y-8">
		{#each data.plan.training_sessions as session}
			<div
				class="block card variant-soft p-4 rounded-container-token"
				data-sveltekit-preload-data="hover"
			>
				<a
					class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-8"
					href="/plans/{data.plan.id}/sessions/{session.id}"
				>
					<div class="space-y-4">
						<h2 class="h2">{session.title}</h2>
						<span>{session.description}</span>
					</div>
				</a>
			</div>
		{/each}
	</section>
</div>
