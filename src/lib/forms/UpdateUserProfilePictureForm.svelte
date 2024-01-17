<script lang="ts">
	import { Avatar, FileDropzone, type ToastSettings } from '@skeletonlabs/skeleton';
	import { Upload } from 'lucide-svelte';

	import Button from '$lib/components/Button.svelte';
	import handleGetAvatarPresignedURL from '$lib/utils/minio/client/profile-picture';
	import { page } from '$app/stores';
	let form: HTMLFormElement;
	let files: FileList | undefined;

	function onChangeHandler(e: Event): void {
		let t: ToastSettings;
		if (files) {
			if (files.length === 0) {
				// ctx.addIssue({
				// 	code: z.ZodIssueCode.custom,
				// 	message: 'File must be provided'
				// });
			}
			if (files.length > 1) {
				// ctx.addIssue({
				// 	code: z.ZodIssueCode.custom,
				// 	message: 'Only one file may be provided'
				// });
			}

			if (
				!['image/webp', 'image/png', 'image/svg', 'image/jpg', 'image/jpeg'].includes(files[0].type)
			) {
				// ctx.addIssue({
				// 	code: z.ZodIssueCode.custom,
				// 	message: 'File must be a valid image type'
				// });
			}

			if (files[0].size > 1024 * 1024 * 5) {
				// ctx.addIssue({
				// 	code: z.ZodIssueCode.custom,
				// 	message: 'File must be less than 5MB'
				// });
			}
			form.requestSubmit();
		}
	}
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Profile Picture</h1>
	</header>
	<section class="flex flex-row p-4">
		<div class="w-1/4 flex items-center align-middle justify-center">
			{#await handleGetAvatarPresignedURL($page.data.session.user.userId)}
				<Avatar src="" initials={String($page.data.session.user.username).slice(0, 2)} />
			{:then obj}
				<Avatar src={obj.presignedUrl} initials={String($page.data.session.user.username).slice(0, 2)} />
			{/await}
		</div>
		<div class="w-3/4">
			<form
				id="updateUserProfilePicture"
				action="/settings/?/updateUserProfilePicture"
				method="post"
				enctype="multipart/form-data"
				bind:this={form}
			>
				<FileDropzone
					on:change={onChangeHandler}
					type="file"
					accept="image/*"
					multiple={false}
					name="files"
					id="files"
				>
					<svelte:fragment slot="lead">
						<Upload class="w-full" />
					</svelte:fragment>
					<svelte:fragment slot="message">Upload an Image</svelte:fragment>
					<!-- <svelte:fragment slot="meta">img, png, jpeg, etc.</svelte:fragment> -->
				</FileDropzone>
				<Button
					shadow="shadow-md"
					color="variant-filled-primary"
					form="updateUserProfilePicture"
					type="submit"
					class="btn ">Upload</Button
				>
			</form>
		</div>
	</section>
</div>
