<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { newImageSchema, type NewImageSchema } from '$lib/schemas';
	import { Avatar, FileDropzone, focusTrap } from '@skeletonlabs/skeleton';
	import {
		fileProxy,
		superForm,
		type Infer,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	export let form_data: SuperValidated<Infer<NewImageSchema>>;
	const { form, errors, constraints, enhance, delayed, submit } = superForm(
		form_data,
		{
			id: 'updateUserAvatar',
			applyAction: true,
			invalidateAll: true,
			resetForm: false,
			validators: zod(newImageSchema),
			delayMs: 0,
			timeoutMs: 8000,
			onResult: async ({ result }) => {
				switch (result.type) {
					case 'success':
						await invalidateAll();
						break;
				}
			}
		}
	);
	let isFocused: boolean = false;

	const file = fileProxy(form, 'image');
</script>

<form
	id="updateUserAvatar"
	enctype="multipart/form-data"
	use:focusTrap={isFocused}
	method="POST"
	action="/settings/?/updateUserAvatar"
	use:enhance
>
	{#if $page.data.user}
		{#if $page.data.user.avatarFileId}
			<Avatar
				src={`/api/images/${$page.data.user.avatarFileId}`}
				initials={String($page.data.user.username).slice(0, 2)}
				width="w-36"
				shadow="shadow-lg"
				rounded="rounded-sm"
				fetchpriority="high"
				loading="eager"
				class="group-hover:hidden"
			/>
		{:else}
			<Avatar
				initials={String($page.data.user.username).slice(0, 2)}
				width="w-36"
				shadow="shadow-lg"
				rounded="rounded-sm"
				fetchpriority="high"
				loading="eager"
				class="group-hover:hidden"
			/>
		{/if}
		<FileDropzone
			type="file"
			name="image"
			accept="image/png, image/jpeg"
			on:change={submit}
			class="w-full h-32 hidden group-hover:flex"
			bind:files={$file}
		>
			<svelte:fragment slot="message"
				><strong>Upload</strong> an image</svelte:fragment
			>
		</FileDropzone>
	{/if}
</form>
