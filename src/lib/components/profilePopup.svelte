<script lang="ts">
	import Link from './Link.svelte';
	import { Avatar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import type { Session } from 'lucia';
	import handleGetAvatarPresignedURL from '$lib/utils/minio/client/profile-picture'

	export let session: Session;

	const profilePopup: PopupSettings = {
		event: 'click',
		target: 'profilePopup',
		placement: 'bottom'
	};
	
</script>

<button class="btn" use:popup={profilePopup}>
	{#await handleGetAvatarPresignedURL(session.user.userId)}
		<Avatar src="" initials={String(session.user.username).slice(0, 2)} />
	{:then obj}
		<Avatar src={obj.presignedUrl} initials={String(session.user.username).slice(0, 2)} />
	{/await}
	
</button>

<div class="card p-4 soft-filled-primary" data-popup="profilePopup">
	<h3 class="h4 w-full font-serif">@{session.user.username}</h3>
	<hr class="py-2" />
	<div class="flex flex-col items-center justify-center align-middle gap-1">
		<Link label={'Dashboard'} href="/dashboard">Dashboard</Link>
		<Link label={'Settings'} href="/settings">Settings</Link>
		<Link label={'Sign Out'} href="/sign-out">Sign-Out</Link>
	</div>
</div>
