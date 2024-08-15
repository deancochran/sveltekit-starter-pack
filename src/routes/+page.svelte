<script lang="ts">
	import { page } from '$app/stores';
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="page-container flex items-center justify-center align-middle">
	<div class="card p-4 flex-col gap-2 flex items-center justify-center align-middle">
		<h1 class="h1 font-serif">
			Welcome {#if $page.data?.user}
				{$page.data?.user.username}
			{:else}
				Alien
			{/if}
		</h1>
		<span
			>To an opinionated Authentication and Billing Implementation for Sveltekit using Stripe</span
		>
		{#if !data.user}
			<p>
				Need an Account? <Link
					label={'Sign Up'}
					shadow="shadow-md"
					color="variant-soft-secondary"
					href="/sign-up">Sign-Up</Link
				>
			</p>
		{/if}
	</div>
</div>
