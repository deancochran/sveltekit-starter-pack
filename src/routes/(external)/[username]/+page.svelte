<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { FriendshipStatus, UserRole } from '@prisma/client';
	import FollowButton from '$lib/components/FollowButton/FollowButton.svelte';
	import AcceptFriendshipButton from '$lib/components/AcceptFriendshipButton/AcceptFriendshipButton.svelte';

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
						<Avatar
							src=""
							initials={String(data.profile_user.username).slice(0, 2)}
							border="border-4 border-surface-300-600-token hover:!border-primary-500"
						/>
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

	<div class="card">
		{#if data.can_view}
			<h1 class="h3 text-center p-[20%]">Viewing!</h1>
		{:else}
			<h1 class="h3 text-center p-[20%]">This page is private</h1>
		{/if}
	</div>
</div>
