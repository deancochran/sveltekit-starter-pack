<script lang="ts">
	import { page } from '$app/stores';
	import { FriendshipStatus, type Friendship } from '@prisma/client';
	import Button from '$lib/components/Button.svelte';

	export let friendship: Friendship | undefined;
	export let addressed_user: any;
</script>

<form method="POST" name="friendship">
	<!-- PRIVATE PROFILE -->
	{#if friendship}
		{#if friendship.status == FriendshipStatus.ACCEPTED}
			<Button color="variant-ghost-surface" formaction="?/unfollow" type="submit" class="btn"
				>Unfollow</Button
			>
		{:else if friendship.status == FriendshipStatus.DECLINED || friendship.status == FriendshipStatus.BLOCKED}
			<Button color="variant-ghost-surface" formaction="?/request" type="submit" class="btn"
				>Follow</Button
			>
		{:else if friendship.status == FriendshipStatus.REQUESTED}
			<Button
				disabled={true}
				shadow="shadow-md"
				color="variant-filled-surface"
				form="friendship"
				type="button"
				class="btn">Requested</Button
			>
		{/if}
	{:else if $page.data.user && $page.data.user.id != addressed_user.id}
		<!-- PUBLIC PROFILE -->
		<Button color="variant-ghost-surface" formaction="?/request" type="submit" class="btn"
			>Follow</Button
		>
	{/if}
</form>
