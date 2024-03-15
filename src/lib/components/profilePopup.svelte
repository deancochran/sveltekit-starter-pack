<script lang="ts">
	import Link from './Link.svelte';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { User } from 'lucia';

	import UserAvatar from './UserAvatar/UserAvatar.svelte';
	import { createEventDispatcher } from 'svelte';

	export let user: User;

	const profilePopup: PopupSettings = {
		event: 'click',
		target: 'profilePopup',
		placement: 'bottom'
	};
</script>

<button class="btn relative" use:popup={profilePopup}>
	<UserAvatar />
</button>

<div class="card p-4 soft-filled-primary" data-popup="profilePopup">
	<h3 class="h4 w-full font-serif">@{user.username}</h3>
	<hr class="py-2" />
	<div class="flex flex-col items-center justify-center align-middle gap-1">
		<Link on:click label={'Dashboard'} href="/dashboard">Dashboard</Link>
		<Link on:click label={'Settings'} href="/settings">Settings</Link>
		<Link on:click label={'Sign Out'} href="/sign-out">Sign-Out</Link>
	</div>
</div>
