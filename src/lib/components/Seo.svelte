<script lang="ts">
	import { page } from '$app/stores';
	//@ts-expect-error
	import SvelteSeo from 'svelte-seo';
	import { PUBLIC_CANONICAL_URL } from '$env/static/public';
	import { APP_NAME, APP_DESCRIPTION } from '$lib/constants';
	let title: string;
	let description: string;
	page.subscribe((pageStore) => {
		title = pageStore.data.title ?? APP_NAME;
		description = pageStore.data.description ?? APP_DESCRIPTION;
	});
</script>

<SvelteSeo bind:title bind:description canonical={PUBLIC_CANONICAL_URL} />
