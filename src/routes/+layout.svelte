<script lang="ts">
	import 'highlight.js/styles/github-dark.css';
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
		storeHighlightJs
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
	import AddInterval from '$lib/modals/AddInterval.svelte';

	import { slide } from 'svelte/transition';
	import Button from '$lib/components/Button.svelte';
	import CookiePolicy from '$lib/modals/CookiePolicy.svelte';

	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import CreateWahooWorkout from '$lib/modals/CreateWahooWorkout.svelte';

	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();


	import hljs from 'highlight.js/lib/core';

	// Import each language module you require
	import xml from 'highlight.js/lib/languages/xml'; // for HTML
	import css from 'highlight.js/lib/languages/css';
	import json from 'highlight.js/lib/languages/json';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import shell from 'highlight.js/lib/languages/shell';

	// Register each imported language module
	hljs.registerLanguage('language-xml', xml); // for HTML
	hljs.registerLanguage('language-css', css);
	hljs.registerLanguage('language-json', json);
	hljs.registerLanguage('language-js', javascript);
	hljs.registerLanguage('language-ts', typescript);
	hljs.registerLanguage('language-shell', shell);
	storeHighlightJs.set(hljs);

	// init Maplibre Stores
	setMapContext();

	const toastStore = getToastStore();
	const toast = getFlash(page, {
		clearOnNavigate: false
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
		SearchPostsModal: { ref: SearchPostsModal },
		AddInterval: { ref: AddInterval },
		CookiePolicy: { ref: CookiePolicy },
		CreateWahooWorkout: { ref: CreateWahooWorkout }
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

	async function detectServiceWorkerUpdate() {
		const registry = await navigator.serviceWorker.ready;
		registry.addEventListener('updatefound', () => {
			const sw = registry.installing;
			sw?.addEventListener('statechange', () => {
				if (sw.state == 'installed') {
					modalStore.trigger(swUpdateModal);
					if (confirm('Want to Reload?')) {
						window.location.reload();
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
		detectServiceWorkerUpdate();
	});

	function triggerCookiePolicy(): void {
		modalStore.trigger({
			type: 'component',
			component: 'CookiePolicy'
		});
	}
	const handleConsent: SubmitFunction = (e) => {
		invalidateAll();
	};
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
<Modal zIndex="z-[998]" components={modalRegistry} />
<Toast zIndex="z-[999]" />
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
				<div class=" flex flex-row items-center sm:gap-2">
					<button
						type="button"
						on:click={triggerSearchPostsModal}
						class="btn variant-ghost-surface flex w-full items-center align-middle justify-between space-x-4 text-base"
					>
						<!-- <SearchIcon /> -->
						<p class="flex">Search...</p>
						<kbd class="kbd">Ctrl + K</kbd>
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

	<div class="flex items-center justify-center p-4 align-middle shadow-inner">
		<Transition bind:key={data.pathname}>
			<slot />
		</Transition>
	</div>

	<svelte:fragment slot="footer">
		{#if !data.consent_cookie}
			<form
				use:enhance={handleConsent}
				method="POST"
				action="/?/setCookiePolicy"
				out:slide={{ duration: 100 }}
				class="w-full p-2 bg-surface-200 dark:bg-surface-800 shadow-2xl flex items-center align-middle justify-between"
			>
				<span
					>Please Accept our <button
						type="button"
						class="btn m-0 p-0 text-primary-500"
						on:click={triggerCookiePolicy}>Cookie Policy</button
					>
				</span>
				<Button type="submit" class="btn variant-filled-primary py-2">Accept</Button>
			</form>
		{/if}
	</svelte:fragment>
</AppShell>
