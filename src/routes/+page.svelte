<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="page-container flex items-center justify-center align-middle">
	<div class="card p-4 flex-col gap-2 flex items-center justify-center align-middle">
		<h1 class="h1 font-serif">
			Welcome {#if data.session} {data.session.user.username} {:else} Alien {/if}
			
		</h1>
		<span>To an opinionated Authentication Implementation for Sveltekit</span>
		{#if !data.session} 
			<p>Need an Account? <Link primary_color_text={true} class="btn m-0 px-4" href="/sign-up">Sign-Up</Link></p>
		{/if}
	</div>
</div>
