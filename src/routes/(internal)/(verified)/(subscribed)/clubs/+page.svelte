<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import {
		Avatar,
		Paginator,
		getToastStore,
		type PaginationSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { LucideUsers } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	export let data: PageData;
	let toastStore = getToastStore();

	// Pagination
	async function onPageChange(e: CustomEvent): Promise<void> {
		const response = await fetch(`/api/clubs?page=${e.detail}`);
		console.log(response);
		if (response.ok) {
			clubs = await response.json();
		} else {
			let t: ToastSettings = {
				message: 'Failed to get next page',
				background: 'variant-filled-warning'
			};
			toastStore.trigger(t);
		}
	}

	function onAmountChange(e: CustomEvent): void {
		console.log('event:amount', e.detail);
	}

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: data.clubs_count,
		amounts: [5]
	} as PaginationSettings;

	$: pagination_disabled = false;
	$: clubs = data.clubs;
</script>

<!-- Hero! -->

<!-- List of user clubs -->
<div class="px-4">
	<div class="flex items-center align-middle justify-between flex-nowrap">
		<h1 class="h1">Your Clubs</h1>
		<Link
			color="variant-filled-primary"
			label="Create Club"
			type="btn"
			shadow="shadow-md"
			href="/clubs/create">Create Club</Link
		>
	</div>
	{#if data.user_memberships.length < 1}
		<div class="py-5">
			<div class="card py-20 gap-4 text-center">
				<h1 class="h3">No Clubs</h1>
			</div>
		</div>
	{:else}
		<div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto py-5">
			{#each data.user_memberships as membership}
				<button
					on:click={() => {
						goto(`/clubs/${membership.club.id}`);
					}}
					class="snap-start shrink-0 card card-hover w-40 md:w-80 h-32 relative overflow-hidden flex items-end align-middle justify-center"
				>
					{#if membership.club.banner_file_id}
						<img
							src={`/api/images/${membership.club.banner_file_id}`}
							class="absolute object-cover object-bottom rounded-none overflow-hidden w-full group-hover:hidden"
							alt="Club Banner"
						/>
					{:else}
						<div
							class="placeholder bg-cover bg-surface-backdrop-token h-full w-full rounded-none"
						/>
					{/if}

					<div class="isolate h-1/3 w-full flex flex-row bg-surface-500">
						{#if membership.club?.avatar_file_id}
							<Avatar
								src={`/api/images/${membership.club?.avatar_file_id}`}
								initials={String(membership.club.name).slice(0, 2)}
								width="w-16"
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								loading="eager"
								class="group-hover:hidden"
							/>
						{:else}
							<Avatar
								initials={String(membership.club?.name).slice(0, 2)}
								width="w-16"
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								loading="eager"
								class="group-hover:hidden"
							/>
						{/if}
						<h4 class="w-full h4 flex items-center align-middle justify-center text-center">
							{membership.club.name}
						</h4>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Searchable Paginated table of clubs -->
<!-- Responsive Container (recommended) -->
<div class="flex flex-col gap-2 px-4 table-container">
	<!-- <form name="search" method="GET" class=" card flex flex-row items-center align-middle"> -->
	<!-- 	<input -->
	<!-- 		class="input" -->
	<!-- 		bind:value={search_value} -->
	<!-- 		placeholder={'Search'} -->
	<!-- 		spellcheck="false" -->
	<!-- 		on:input={() => {}} -->
	<!-- 	/> -->
	<!-- 	<button formaction="?/search" color="variant-filled-primary" type="submit" form="search" -->
	<!-- 		>Search</button -->
	<!-- 	> -->
	<!-- </form> -->
	<!-- Native Table Element -->
	<table class="table table-hover table-interactive">
		<thead>
			<tr>
				<th>Logo</th>
				<th>Name</th>
				<th>Established</th>
				<th>Members</th>
			</tr>
		</thead>
		<tbody>
			{#each clubs as club}
				<tr on:click={() => goto(`/clubs/${club.id}`)}>
					<td>
						{#if club?.avatar_file_id}
							<Avatar
								src={`/api/images/${club?.avatar_file_id}`}
								initials={String(club.name).slice(0, 2)}
								width="w-16"
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								loading="eager"
								class="group-hover:hidden"
							/>
						{:else}
							<Avatar
								initials={String(club?.name).slice(0, 2)}
								width="w-16"
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								loading="eager"
								class="group-hover:hidden"
							/>
						{/if}
					</td>
					<td>
						<div class="flex flex-col gap-1">
							<span class=" h4 font-bold">
								{club.name}
							</span>
							<span class="line-clamp-2">
								{club.description}
							</span>
						</div>
					</td>
					<td>{club.created_at}</td>
					<td>{club._count.members}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	{#if data.clubs.length < 1}
		<div class="flex items-center align-middle justify-center py-20 w-full">
			<h3 class="h3">No Clubs Found</h3>
		</div>
	{/if}
	<Paginator
		bind:disabled={pagination_disabled}
		bind:settings={paginationSettings}
		on:page={onPageChange}
		on:amount={onAmountChange}
	></Paginator>
</div>
