<script lang="ts">
	import { page } from '$app/stores';

	$: message = $page.error?.message;
</script>

<h1>{message}</h1>

{#if $page.status == 404}
	<h1>You must be lost</h1>
	<a href="/">Go Home</a>
{:else if $page.status == 500}
	<h1>Whoops</h1>
	<p>We are investigating this issue</p>
{/if}
