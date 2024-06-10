<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { LucideUsers } from 'lucide-svelte';

	export let data: PageData;
</script>

<!-- HERO -->

<!-- Club MetaData (editable for admins) -->
<div class="card">
	<div class="card-header relative h-[30vh] overflow-auto">
		{#if data.club.banner_url}
			<!-- <enhanced:img class="bg-cover z-0 absolute inset-0" -->
			<!-- 	src={data.club.banner_url} -->
			<!-- 	alt="Club Banner" -->
			<!-- /> -->
		{:else}{/if}
		<div class="placeholder h-full" />
	</div>
	<div class="flex flex-row h-24 items-start align-baseline justify-start px-4">
		<div class="flex flex-row h-24 -mt-6 items-end align-baseline justify-start px-12">
			<Avatar src={''} width="w-36" shadow="shadow-lg" rounded="rounded-none"
				><LucideUsers /></Avatar
			>

			<h4 class="h4 p-4">
				{data.club.name}
			</h4>
		</div>
		<div class="flex flex-row w-full h-full items-center align-middle justify-end gap-4 px-4">
			<div class="flex flex-row flex-nowrap items-end align-bottom justify-center gap-1">
				<LucideUsers />
				{data.club._count.members}
			</div>
		</div>
	</div>
</div>

<!-- Upcoming Events -->

<!-- CLub Members Editable for admins-->
