<script lang="ts">
	import { FileDropzone, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Upload } from 'lucide-svelte';
	import UserAvatar from '$lib/components/UserAvatar/UserAvatar.svelte';
	import { enhance } from '$app/forms';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	let formEl: HTMLFormElement;
	let files: FileList | undefined;
	let loading = false;

	const toastStore = getToastStore();

	function isPictureValid() {
		let t: ToastSettings | undefined = undefined;
		if (files) {
			if (files.length === 0) {
				t = {
					message: 'File must be provided',
					background: 'variant-filled-warning'
				} as const;
			}
			if (files.length > 1) {
				t = {
					message: 'Only one file may be provided',
					background: 'variant-filled-warning'
				} as const;
			}

			if (
				!['image/webp', 'image/png', 'image/svg', 'image/jpg', 'image/jpeg'].includes(files[0].type)
			) {
				t = {
					message: 'File must be a valid image type than 5MB',
					background: 'variant-filled-warning'
				} as const;
			}
			const kb=50
			const size_limit= (1024 * 1024 * kb)/1001
			if (files[0].size >size_limit ) {
				t = {
					message: `File must be less than ${kb}KB`,
					background: 'variant-filled-warning'
				} as const;
			}
		}

		if (t != undefined) {
			toastStore.trigger(t);
			return false;
		} else {
			return true;
		}
	}
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Profile Picture</h1>
	</header>
	<section class="flex flex-row p-4 space-x-4">
		<div class="w-1/4 flex items-center align-middle justify-center">
			<UserAvatar />
		</div>
		<div class="w-3/4 flex items-center align-middle justify-center">
			<form
				id="updateUserProfilePicture"
				action="/settings/?/updateUserProfilePicture"
				method="post"
				enctype="multipart/form-data"
				class="w-full h-full flex items-center align-middle justify-center"
				bind:this={formEl}
				use:enhance={(form) => {
					loading = true;
					const { action, formData, formElement, controller, submitter, cancel } = form;
					if(!isPictureValid()){
						loading = false;
						cancel()
					};

					return async ({ update }) => {
						await update({ reset: true, invalidateAll: true });
						loading = false;
					};
				}}
			>
				{#if loading}
					<LoadingIcon />
				{:else}
					<FileDropzone
						on:change={() => {
							formEl.requestSubmit();
						}}
						type="file"
						accept="image/*"
						name="file"
						class="w-full h-full"
						bind:files
					>
						<svelte:fragment slot="lead">
							<Upload class="w-full" />
						</svelte:fragment>
						<svelte:fragment slot="message">Upload an Image</svelte:fragment>
						<svelte:fragment slot="meta">img, png, jpeg, etc.</svelte:fragment>
					</FileDropzone>
				{/if}
			</form>
		</div>
	</section>
</div>
