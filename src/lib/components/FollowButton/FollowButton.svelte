<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { friendship } from '$lib/drizzle/schema';
	import type { InferSelectModel } from 'drizzle-orm';

	export let _friendship: InferSelectModel<typeof friendship> | undefined;
	export let addressed_user: any;
</script>

<form method="POST" name="friendship">
	<!-- PRIVATE PROFILE -->
	{#if _friendship}
		{#if _friendship.status == 'ACCEPTED'}
			<Button
				color="variant-ghost-surface"
				formaction="?/unfollow"
				type="submit"
				class="btn">Unfollow</Button
			>
		{:else if _friendship.status == 'DECLINED' || _friendship.status == 'BLOCKED'}
			<Button
				color="variant-ghost-surface"
				formaction="?/request"
				type="submit"
				class="btn">Follow</Button
			>
		{:else if _friendship.status == 'REQUESTED'}
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
		<Button
			color="variant-ghost-surface"
			formaction="?/request"
			type="submit"
			class="btn">Follow</Button
		>
	{/if}
</form>
