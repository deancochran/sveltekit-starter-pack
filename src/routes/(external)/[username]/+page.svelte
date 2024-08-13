<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { FriendshipStatus, UserRole } from '@prisma/client';
	import FollowButton from '$lib/components/FollowButton/FollowButton.svelte';
	import AcceptFriendshipButton from '$lib/components/AcceptFriendshipButton/AcceptFriendshipButton.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { LucideUsers } from 'lucide-svelte';

	export let data: PageData;
</script>

<div class="flex flex-col gap-4 max-w-5xl mx-auto md:px-12">
	{#if data.profile_user.requested_friendships.at(0)?.status == FriendshipStatus.REQUESTED}
		<AcceptFriendshipButton />
	{/if}
	<div class="card">
		<!-- Header -->
		<header class="card-header">
			<div class="flex flex-row flex-wrap items-center align-middle justify-between gap-2">
				<!-- Avatar, Hero -->
				<div class="flex flex-row items-center align-middle gap-2">
					<div class="relative">
						{#if $page.data.user?.avatar_file_id}
							<Avatar
								src={`/api/images/${data.profile_user?.avatar_file_id}`}
								initials={String(data.profile_user.username).slice(0, 2)}
								border="border-4 border-surface-300-600-token hover:!border-primary-500"
							/>
						{:else}
							<Avatar
								initials={String(data.profile_user.username).slice(0, 2)}
								border="border-4 border-surface-300-600-token hover:!border-primary-500"
							/>
						{/if}
						{#if data.profile_user.role != UserRole.BASE}
							<span class="absolute top-0 -right-2 chip variant-filled px-1 p-px"
								>{data.profile_user.role}</span
							>
						{/if}
					</div>
					<div class="flex flex-col items-start align-middle justify-start">
						<!-- Created At -->
						<h1 class="h1">{data.profile_user.username}</h1>
						<p class="text-sm text-on-surface-token text-surface-600-300-token">
							Joined: {data.profile_user.created_at.toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							})}
						</p>
					</div>
				</div>
				<div class="flex">
					<FollowButton
						bind:friendship={data.addressed_friendship}
						bind:addressed_user={data.profile_user}
					/>
				</div>
			</div>
		</header>
		<!-- Body -->
		<!-- Footer -->
		<footer class="card-footer"></footer>
	</div>

	<!-- Member of these clubs -->
	<div></div>
	{#if data.profile_user.club_memberships.length < 1}
		<div class="py-4">
			<div class="card py-20 gap-4 text-center">
				<h1 class="h3">No Clubs</h1>
			</div>
		</div>
	{:else}
		<div
			class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto p-4 -ml-4"
		>
			{#each data.profile_user.club_memberships as membership}
				<button
					on:click={() => {
						goto(`/clubs/${membership.club.id}`);
					}}
					class="snap-start shrink-0 card card-hover w-40 md:w-80 h-32 relative overflow-auto flex items-end align-middle justify-center"
				>
					{#if membership.club.banner_file_id}
						<!-- BAD -->
						<!-- <enhanced:img -->
						<!-- 	class="bg-cover brightness-75 z-0 absolute inset-0" -->
						<!-- 	src={membership.club.banner_file_id} -->
						<!-- 	alt="lost" -->
						<!-- /> -->
					{/if}
					<div class="isolate h-1/3 w-full flex flex-row bg-surface-500">
						<Avatar src={''} rounded="rounded-none"><LucideUsers /></Avatar>
						<h4 class="w-full h4 flex items-center align-middle justify-center text-center">
							{membership.club.name}
						</h4>
					</div>
				</button>
			{/each}
		</div>
	{/if}
	<div class="card">
		{#if data.can_view}
			<h1 class="h3 text-center p-[20%]">Viewing!</h1>
		{:else}
			<h1 class="h3 text-center p-[20%]">This page is private</h1>
		{/if}
	</div>
</div>
