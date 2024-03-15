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
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { storePopup } from '@skeletonlabs/skeleton';
	import ThemeSelector from '$lib/components/ThemeSelector.svelte';
	import Link from '$lib/components/Link.svelte';
	import ProfilePopup from '$lib/components/profilePopup.svelte';
	import type { LayoutData } from './$types';
	import SideBarButton from '$lib/components/SideBarButton.svelte';
	import NavBarMobile from '$lib/components/NavBarMobile.svelte';
	//Modal Registry Components
	import DeleteUserForm from '$lib/forms/DeleteUserForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { setMapContext } from '$lib/components/Map/stores';
	import { onMount } from 'svelte';
	import SearchWorker from '$lib/utils/posts/search-worker?worker';
	import SearchPostsModal from '$lib/modals/SearchPostsModal.svelte';
	export let data: LayoutData;

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
	initializeStores();

	// init Maplibre Stores
	setMapContext();

	const toastStore = getToastStore();
	const toast = getFlash(page, {
		clearOnNavigate: false,
		flashCookieOptions: { sameSite: 'lax' }
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
	<NavBarMobile bind:session={data.session} on:close={closeDrawer} />
</Drawer>
<AppShell>
	<svelte:fragment slot="header">
		<AppBar
			shadow="shadow-md"
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
		>
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
				<SideBarButton on:click={openDrawer} />

				<nav class="hidden md:flex space-x-2 h-[5vh]">
					<button on:click={triggerSearchPostsModal}>
						<!-- <SearchIcon /> -->
						<span>Search</span>
						<div class="shortcut">
							<kbd>{'Ctrl'}</kbd> + <kbd>K</kbd>
						</div>
					</button>
					{#if data.user}
						<ProfilePopup bind:user={data.user} />
					{:else}
						<Link
							label={'Sign In'}
							shadow="shadow-md"
							color="variant-soft-secondary"
							href="/sign-in">Sign-In</Link
						>
						<Link label={'Sign Up'} shadow="shadow-md" color="variant-soft-tertiary" href="/sign-up"
							>Sign-Up</Link
						>
					{/if}
				</nav>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	{#key data.pathname}
		<div in:fade={{ duration: 300, delay: 400 }} out:fade={{ duration: 300 }}>
			<slot />
		</div>
	{/key}

	<svelte:fragment slot="pageFooter">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="flex flex-col">
					<h1 class="h1 font-serif bg-op font-bold text-4xl">
						<span class="text-surface">cadence</span>
					</h1>
					<p>Modern Sveltekit Auth and Billing</p>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<Link label={'cadence'} type="btn-icon" href="https://github.com/deancochran/cadence">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						class="fill-current"
						><path
							d="M20.38 8.53c.16-.4.68-1.99-.17-4.14c0 0-1.31-.39-4.3 1.61c-1.25-.33-2.58-.38-3.91-.38c-1.32 0-2.66.05-3.91.38c-2.99-2.03-4.3-1.61-4.3-1.61c-.85 2.15-.33 3.74-.16 4.14C2.61 9.62 2 11 2 12.72c0 6.44 4.16 7.89 10 7.89c5.79 0 10-1.45 10-7.89c0-1.72-.61-3.1-1.62-4.19M12 19.38c-4.12 0-7.47-.19-7.47-4.19c0-.95.47-1.85 1.27-2.58c1.34-1.23 3.63-.58 6.2-.58c2.59 0 4.85-.65 6.2.58c.8.73 1.3 1.62 1.3 2.58c0 3.99-3.37 4.19-7.5 4.19m-3.14-6.26c-.82 0-1.5 1-1.5 2.22c0 1.23.68 2.24 1.5 2.24c.83 0 1.5-1 1.5-2.24c0-1.23-.67-2.22-1.5-2.22m6.28 0c-.83 0-1.5.99-1.5 2.22c0 1.24.67 2.24 1.5 2.24c.82 0 1.5-1 1.5-2.24c0-1.23-.64-2.22-1.5-2.22z"
						/></svg
					>
				</Link>
				<Link
					label={'Buy Me a Coffee'}
					type="btn-icon"
					href="https://www.buymeacoffee.com/deancochran"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						class="fill-current"
						><path
							d="m20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379c-.197-.069-.42-.098-.57-.241c-.152-.143-.196-.366-.231-.572c-.065-.378-.125-.756-.192-1.133c-.057-.325-.102-.69-.25-.987c-.195-.4-.597-.634-.996-.788a5.723 5.723 0 0 0-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 0 0-3.7.062c-.915.083-1.88.184-2.75.5c-.318.116-.646.256-.888.501c-.297.302-.393.77-.177 1.146c.154.267.415.456.692.58c.36.162.737.284 1.123.366c1.075.238 2.189.331 3.287.37c1.218.05 2.437.01 3.65-.118c.299-.033.598-.073.896-.119c.352-.054.578-.513.474-.834c-.124-.383-.457-.531-.834-.473c-.466.074-.96.108-1.382.146c-1.177.08-2.358.082-3.536.006a22.228 22.228 0 0 1-1.157-.107c-.086-.01-.18-.025-.258-.036c-.243-.036-.484-.08-.724-.13c-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 0 1 3.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145c.392.085.895.113 1.07.542c.055.137.08.288.111.431l.319 1.484a.237.237 0 0 1-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 0 1-4.743.295a37.059 37.059 0 0 1-4.699-.304c-.14-.017-.293-.042-.417-.06c-.326-.048-.649-.108-.973-.161c-.393-.065-.768-.032-1.123.161c-.29.16-.527.404-.675.701c-.154.316-.199.66-.267 1c-.069.34-.176.707-.135 1.056c.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0 0 11.343.376a.483.483 0 0 1 .535.53l-.071.697l-1.018 9.907c-.041.41-.047.832-.125 1.237c-.122.637-.553 1.028-1.182 1.171c-.577.131-1.165.2-1.756.205c-.656.004-1.31-.025-1.966-.022c-.699.004-1.556-.06-2.095-.58c-.475-.458-.54-1.174-.605-1.793l-.731-7.013l-.322-3.094c-.037-.351-.286-.695-.678-.678c-.336.015-.718.3-.678.679l.228 2.185l.949 9.112c.147 1.344 1.174 2.068 2.446 2.272c.742.12 1.503.144 2.257.156c.966.016 1.942.053 2.892-.122c1.408-.258 2.465-1.198 2.616-2.657c.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 0 1 .39-.426c.402-.078.787-.212 1.074-.518c.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233c-2.416.359-4.866.54-7.308.46c-1.748-.06-3.477-.254-5.207-.498c-.17-.024-.353-.055-.47-.18c-.22-.236-.111-.71-.054-.995c.052-.26.152-.609.463-.646c.484-.057 1.046.148 1.526.22c.577.088 1.156.159 1.737.212c2.48.226 5.002.19 7.472-.14c.45-.06.899-.13 1.345-.21c.399-.072.84-.206 1.08.206c.166.281.188.657.162.974a.544.544 0 0 1-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 0 1-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38c0 0 1.243.065 1.658.065c.447 0 1.786-.065 1.786-.065c.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 0 0-1.322-.238c-.826 0-1.491.284-2.26.613z"
						/></svg
					>
				</Link>
				<ThemeSelector />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
</AppShell>
