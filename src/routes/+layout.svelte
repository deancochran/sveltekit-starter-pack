<script lang="ts">
	import '../app.postcss';
	import { Toast, initializeStores, AppShell, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { storePopup } from '@skeletonlabs/skeleton';
	import NavBar from '$lib/components/NavBar.svelte';
	import type { LayoutData } from './$types';
	import { Link } from 'svelte-email';
	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	const toastStore = getToastStore();
	const toast = getFlash(page, {
		clearOnNavigate: false,
		flashCookieOptions: { sameSite: 'lax' }
	});

	toast.subscribe(($toast) => {
		if (!$toast) return;
		toastStore.trigger($toast);
	});

</script>

<Toast />
<AppShell>
	<svelte:fragment slot="header">
		<NavBar session={data.session}/>
	</svelte:fragment>

	{#key data.pathname}
		<div in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>
			<slot />
		</div>
	{/key}

	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
