<script lang="ts">
	import '../app.postcss';
	// import 'maplibre-gl/dist/maplibre-gl.css';
	import {
		Toast,
		initializeStores,
		AppShell,
		Drawer,
		AppBar,
		getDrawerStore,
		type DrawerSettings,
		Modal,
		type ModalComponent,
		type ModalSettings,
		getModalStore,
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Link from '$lib/components/Link.svelte';
	import ProfilePopup from '$lib/components/profilePopup.svelte';
	import type { LayoutData } from './$types';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import NavBarMobile from '$lib/components/NavBarMobile.svelte';
	import DeleteUserForm from '$lib/forms/DeleteUserForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { setMapContext } from '$lib/components/Map/stores';
	import { onMount } from 'svelte';
	import SearchPostsModal from '$lib/modals/SearchPostsModal.svelte';
	import Transition from '$lib/transitions/transition.svelte';
	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	// init Maplibre Stores
	setMapContext();

	const toastStore = getToastStore();
	const toast = getFlash(page, {
		clearOnNavigate: false,
		// flashCookieOptions: { sameSite: 'lax' , secure: false},
	});

	toast.subscribe(($toast) => {
		if (!$toast) return;
		toastStore.trigger($toast);
	});
	const drawerStore = getDrawerStore();
	const drawerSettings: DrawerSettings = {
		position: 'right',
		bgDrawer: 'bg-surface-backdrop-token',
		width: 'w-3/4',
		padding: 'p-4',
		rounded: 'rounded-xl',
		bgBackdrop: 'bg-surface-500 bg-opacity-90'
	};

	const openDrawer = async () => {
		drawerStore.open(drawerSettings);
	};
	const closeDrawer = async () => {
		drawerStore.close();
	};

	const modalStore = getModalStore();
	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		DeleteUserForm: { ref: DeleteUserForm },
		SearchPostsModal: { ref: SearchPostsModal }
	};

	const swUpdateModal: ModalSettings = {
		type: 'confirm',
		title: 'Please refresh your page',
		body: 'Changes in your app have been detected.',
		response: (r: boolean) => {
			if (r) {
				window.location.reload();
			}
		}
	};

	async function dectectServiceWorkerUpdate() {
		const registry = await navigator.serviceWorker.ready;
		registry.addEventListener('updatefound', (event) => {
			const sw = registry.installing;
			sw?.addEventListener('statechange', (event) => {
				if (sw.state == 'installed') {
					modalStore.trigger(swUpdateModal);
					if (confirm('Want to Reload?')) {
					}
				}
			});
		});
	}

	function triggerSearchPostsModal() {
		modalStore.trigger({
			type: 'component',
			component: 'SearchPostsModal'
		});
	}

	onMount(() => {
		dectectServiceWorkerUpdate();
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.ctrlKey || e.metaKey) {
			if (e.key === 'k' || e.key === 'K') {
				modalStore.close();
				e.preventDefault();
				e.stopPropagation();
				triggerSearchPostsModal();
			}
		}
	}}
/>

<Seo />
<Toast />
<Modal components={modalRegistry} />
<Drawer>
	<NavBarMobile on:close={closeDrawer} />
</Drawer>
<AppShell>
	<svelte:fragment slot="header">
		<AppBar shadow="shadow-md">
			<svelte:fragment slot="lead">
				<Link label={'cadence'} href="/">
					<h1 class="h1 font-serif bg-op font-bold text-4xl">
						<span
							class="bg-gradient-to-br from-primary-500 to-tertiary-500 bg-clip-text text-transparent box-decoration-clone"
							>cadence</span
						>
					</h1>
				</Link>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class=" flex flex-row items-center">
					<button
						type="button"
						on:click={triggerSearchPostsModal}
						class="btn variant-ghost-surface flex w-full items-center align-middle justify-between space-x-4 text-base"
					>
						<!-- <SearchIcon /> -->
						<p class="flex">Search...</p>
						<span class="hidden sm:flex badge rounded-sm variant-ghost-surface text-sm">
							Ctrl-K
						</span>
					</button>
					<div class="hidden sm:flex w-full">
						{#if data.user}
							<ProfilePopup bind:user={data.user} />
						{:else}
							<Link
								label={'Sign In'}
								shadow="shadow-md"
								color="variant-filled-primary"
								href="/sign-in">Sign In</Link
							>
						{/if}
					</div>
					<SideBarButton on:click={openDrawer} />
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div class="flex items-center justify-center p-4 align-middle">
		<Transition bind:key={data.pathname}>
			<slot />
		</Transition>
	</div>
</AppShell>
