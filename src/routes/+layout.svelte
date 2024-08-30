<script lang="ts">
	import 'highlight.js/styles/github-dark.css';
	import '../app.postcss';
	// import 'maplibre-gl/dist/maplibre-gl.css';
	import { page } from '$app/stores';
	import Link from '$lib/components/Link.svelte';
	import Cadence from '$lib/components/logo/Cadence.svelte';
	import { setMapContext } from '$lib/components/Map/stores';
	import NavBarMobile from '$lib/components/NavBarMobile.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import DeleteUserForm from '$lib/forms/DeleteUserForm.svelte';
	import AddInterval from '$lib/modals/AddInterval.svelte';
	import Transition from '$lib/transitions/transition.svelte';
	import {
		arrow,
		autoUpdate,
		computePosition,
		flip,
		offset,
		shift
	} from '@floating-ui/dom';
	import {
		AppBar,
		AppShell,
		Avatar,
		Drawer,
		type DrawerSettings,
		Modal,
		type ModalComponent,
		type ModalSettings,
		Toast,
		getDrawerStore,
		getModalStore,
		getToastStore,
		initializeStores,
		storeHighlightJs,
		storePopup
	} from '@skeletonlabs/skeleton';
	import { Menu } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { getFlash } from 'sveltekit-flash-message';
	import type { LayoutData } from './$types';

	import Button from '$lib/components/Button.svelte';
	import CookiePolicy from '$lib/modals/CookiePolicy.svelte';
	import { slide } from 'svelte/transition';

	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import CreateClubEvent from '$lib/forms/CreateClubEvent.svelte';
	import CreateWahooWorkout from '$lib/modals/CreateWahooWorkout.svelte';
	import UpdateClubEvent from '$lib/modals/UpdateClubEvent.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	import hljs from 'highlight.js/lib/core';

	// import each language module you require
	import html from 'highlight.js/lib/languages/xml';

	import UpdateClub from '$lib/modals/UpdateClub.svelte';
	import UpdateClubMembers from '$lib/modals/UpdateClubMembers.svelte';
	import javascript from 'highlight.js/lib/languages/javascript';
	import json from 'highlight.js/lib/languages/json';
	import shell from 'highlight.js/lib/languages/shell';
	import typescript from 'highlight.js/lib/languages/typescript';

	// Register each imported language module
	hljs.registerLanguage('html', html);

	hljs.registerLanguage('json', json);
	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('ts', typescript);
	hljs.registerLanguage('shell', shell);
	storeHighlightJs.set(hljs);

	// init Maplibre Stores
	setMapContext();

	const toastStore = getToastStore();
	const toast = getFlash(page, {
		clearOnNavigate: false
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

	page.subscribe((curr) => {
		if (curr.url.pathname === $page.data.pathname) {
			drawerStore.close();
		}
	});

	const modalStore = getModalStore();
	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		DeleteUserForm: { ref: DeleteUserForm },
		AddInterval: { ref: AddInterval },
		CookiePolicy: { ref: CookiePolicy },
		CreateWahooWorkout: { ref: CreateWahooWorkout },
		CreateClubEvent: { ref: CreateClubEvent },
		UpdateClub: { ref: UpdateClub },
		UpdateClubEvent: { ref: UpdateClubEvent },
		UpdateClubMembers: { ref: UpdateClubMembers }
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

	onMount(() => {
		detectServiceWorkerUpdate();
	});

	function triggerCookiePolicy(): void {
		modalStore.trigger({
			type: 'component',
			component: 'CookiePolicy'
		});
	}
	const handleConsent: SubmitFunction = () => {
		invalidateAll();
	};
</script>

<Seo />
<Modal zIndex="z-[998]" components={modalRegistry} />
<Toast zIndex="z-[999]" />
<Drawer>
	<NavBarMobile />
</Drawer>
<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			shadow="shadow-md"
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
			padding="py-2 px-4"
		>
			<svelte:fragment slot="lead">
				<Link class="p-0 m-0" label={'cadence'} href="/">
					<Cadence
						sizing="w-20 h-20 transition-all ease-in-out duration-50 hover:scale-[1.05] hover:scale-[1.1] hover:rotate-6 active:rotate-12"
					/>
				</Link>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $page.data.user}
					<Button
						class="btn p-2 m-0 relative min-w-20 w-20"
						on:click={openDrawer}
					>
						{#if $page.data.user.avatarFileId}
							<Avatar
								src={`/api/images/${$page.data.user.avatarFileId}`}
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								loading="eager"
								width="w-full"
							/>
						{:else}
							<Avatar
								initials={String($page.data.user.username).slice(0, 2)}
								shadow="shadow-lg"
								rounded="rounded-sm"
								fetchpriority="high"
								background="bg-gradient-to-br variant-gradient-tertiary-primary"
								loading="eager"
								width="w-full"
							/>
						{/if}
						{#if $page.data.user.role !== 'BASE'}
							<span
								class="absolute top-0 -right-2 chip variant-filled-surface px-1 p-px"
								>{$page.data.user.role}</span
							>
						{/if}
					</Button>
				{:else}
					<Button
						class="btn p-2 m-0 w-16 h-16 variant-soft-surface rounded-sm"
						on:click={openDrawer}
					>
						<Menu class="w-full h-full" />
					</Button>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<div
		class="flex flex-col items-start justify-start align-middle gap-4 p-4 shadow-inner"
	>
		{#if $page.url.href}
			{@const crumbs = $page.url.pathname.split('/').slice(1)}
			{#if crumbs.length > 1}
				<ol class="flex flex-row gap-2 px-2">
					{#each crumbs as crumb, i}
						{#key crumb}
							{#if i + 1 != crumbs.length}
								<li>
									<a
										class="anchor"
										href={'/' + crumbs.slice(0, i + 1).join('/')}
										>{crumb.charAt(0).toUpperCase() + crumb.slice(1)}</a
									>
								</li>
								<li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
							{:else}
								<li>{crumb.charAt(0).toUpperCase() + crumb.slice(1)}</li>
							{/if}
						{/key}
					{/each}
				</ol>
			{/if}
		{/if}
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
				<Button type="submit" class="btn variant-filled-primary py-2"
					>Accept</Button
				>
			</form>
		{/if}
	</svelte:fragment>
</AppShell>
