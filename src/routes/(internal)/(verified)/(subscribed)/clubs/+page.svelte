<script lang="ts">
	import { goto } from '$app/navigation';
	import Link from '$lib/components/Link.svelte';
	import {
		Avatar,
		Paginator,
		getToastStore,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	export let data: PageData;
	let toastStore = getToastStore();

	// Pagination
	async function onPageChange(e: CustomEvent): Promise<void> {
		const response = await fetch(`/api/clubs?page=${e.detail}`);
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
		// console.log('event:amount', e.detail);
	}

	let paginationSettings = {
		page: 0,
		limit: 5,
		size: data.clubsCount.count,
		amounts: [5]
	};

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
	{#if data.userMemberships.length < 1}
		<div class="py-5">
			<div class="card py-20 gap-4 text-center">
				<h1 class="h3">No Clubs</h1>
			</div>
		</div>
	{:else}
		<div
			class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto py-5"
		>
			{#each data.userMemberships as membership}
				<button
					on:click={() => {
						goto(`/clubs/${membership.club.id}`);
					}}
					class="snap-start shrink-0 card card-hover w-40 md:w-80 h-32 relative overflow-hidden flex items-end align-middle justify-center"
				>
					{#if membership.club.bannerFileId}
						<img
							src={`/api/images/${membership.club.bannerFileId}`}
							class="absolute object-cover object-bottom rounded-none overflow-hidden w-full group-hover:hidden"
							alt="Club Banner"
						/>
					{:else}
						<div
							class="placeholder bg-cover bg-surface-backdrop-token h-full w-full rounded-none"
						/>
					{/if}

					<div class="isolate h-1/3 w-full flex flex-row bg-surface-500">
						{#if membership.club?.avatarFileId}
							<Avatar
								src={`/api/images/${membership.club?.avatarFileId}`}
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
						<h4
							class="w-full h4 flex items-center align-middle justify-center text-center"
						>
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
			{#each clubs as club_obj}
				<tr on:click={() => goto(`/clubs/${club_obj.club.id}`)}>
					<td>
						{#if club_obj.club.avatarFileId}
							<Avatar
								src={`/api/images/${club_obj.club.avatarFileId}`}
								initials={String(club_obj.club.name).slice(0, 2)}
								width="w-16"
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								loading="eager"
								class="group-hover:hidden"
							/>
						{:else}
							<Avatar
								initials={String(club_obj.club.name).slice(0, 2)}
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
								{club_obj.club.name}
							</span>
							<span class="line-clamp-2">
								{club_obj.club.description}
							</span>
						</div>
					</td>
					<td>{club_obj.club.createdAt}</td>
					<td>{club_obj.memberCount}</td>
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
