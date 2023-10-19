<script lang="ts">
	import '../app.postcss';
	import { Toast, initializeStores, type ToastSettings } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	initializeStores();

	const toastStore = getToastStore();
	const toast = getFlash(page, {
		clearOnNavigate: false,
	});

	toast.subscribe(($toast) => {
		if (!$toast) return;
		toastStore.trigger($toast);
	});
</script>

<Toast />

<slot />
