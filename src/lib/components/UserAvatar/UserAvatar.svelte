<script>

	import { page } from "$app/stores";
	import handleGetAvatarPresignedURL from "$lib/utils/minio/client/profile-picture";
	import { Avatar } from "@skeletonlabs/skeleton";

    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher()

</script>
{#await handleGetAvatarPresignedURL($page.data.session.user.userId)}
	<Avatar
		src=""
		initials={String($page.data.session.user.username).slice(0, 2)}
		border="border-4 border-surface-300-600-token hover:!border-primary-500"
		cursor="cursor-pointer"
        on:click={()=>{dispatch('click')}}
	/>
{:then obj}
	<Avatar
		src={obj.presignedUrl}
		initials={String($page.data.session.user.username).slice(0, 2)}
        class='relative border-4 border-surface-300-600-token hover:!border-primary-500 min-w-fit'
        on:click={()=>{dispatch('click')}}
	/>
{/await}
