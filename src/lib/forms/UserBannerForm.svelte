<script lang="ts">
	import { page } from '$app/stores';
	import { FileDropzone, focusTrap } from '@skeletonlabs/skeleton';
	import { fileProxy, superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { new_image_schema, type NewImageSchema } from '$lib/schemas';
	import { zod } from 'sveltekit-superforms/adapters';
	import { invalidateAll } from '$app/navigation';
	export let form_data: SuperValidated<Infer<NewImageSchema>>;
	const { form, errors, constraints, enhance, delayed, submit } = superForm(form_data, {
		id: 'updateUserBanner',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(new_image_schema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			switch (result.type) {
				case 'success':
					await invalidateAll();
					break;
			}
		}
	});
	let isFocused: boolean = false;

	const file = fileProxy(form, 'image');
</script>

<form
	id="updateUserBanner"
	enctype="multipart/form-data"
	use:focusTrap={isFocused}
	method="POST"
	action="/settings/?/updateUserBanner"
	use:enhance
	class="w-full h-full"
>
	{#if $page.data.user?.banner_file_id}
		<img
			src={`/api/images/${$page.data.user.banner_file_id}`}
			class="object-cover rounded-none overflow-hidden w-full group-hover:hidden"
			alt="Club Banner"
		/>
	{:else}
		<div class="placeholder bg-cover bg-surface-backdrop-token h-full w-full rounded-none" />
	{/if}
	<FileDropzone
		type="file"
		name="image"
		accept="image/png, image/jpeg"
		on:change={submit}
		class="w-full h-full hidden group-hover:flex"
		bind:files={$file}
	>
		<svelte:fragment slot="message"><strong>Upload</strong> an image</svelte:fragment>
	</FileDropzone>
</form>
