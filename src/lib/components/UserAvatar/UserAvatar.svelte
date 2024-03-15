<script>
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<Avatar
	src=""
	initials={String($page.data.user?.username).slice(0, 2)}
	border="border-4 border-surface-300-600-token hover:!border-primary-500"
	cursor="cursor-pointer"
	on:click={() => {
		dispatch('click');
	}}
/>
