<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import type { club } from '$lib/drizzle/schema';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import {
		newClubSchema,
		newImageSchema,
		type NewClubSchema,
		type NewImageSchema
	} from '$lib/schemas';
	import {
		Avatar,
		FileDropzone,
		getModalStore,
		SlideToggle
	} from '@skeletonlabs/skeleton';
	import type { InferSelectModel } from 'drizzle-orm';
	import type { SvelteComponent } from 'svelte';
	import {
		fileProxy,
		superForm,
		type SuperValidated
	} from 'sveltekit-superforms';
	import { zod, type Infer } from 'sveltekit-superforms/adapters';
	/** Exposes parent props to this component. */

	export let parent: SvelteComponent;
	const modal = getModalStore();
	let meta = $modal[0].meta as {
		avatar_form: SuperValidated<Infer<NewImageSchema>>;
		banner_form: SuperValidated<Infer<NewImageSchema>>;
		club_form: SuperValidated<Infer<NewClubSchema>>;
		club: InferSelectModel<typeof club>;
	};

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	// const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	// AVATAR
	const {
		form: avatar_form,
		enhance: avatar_enhance,
		delayed: avatar_delayed,
		submit: avatar_submit
	} = superForm(meta.avatar_form, {
		id: 'updateClubAvatar',
		applyAction: true,
		validators: zod(newImageSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			switch (result.type) {
				case 'success':
					if ($modal[0].response) $modal[0].response(true);
					modal.close();
					break;
			}
		}
	});
	const avatar_file = fileProxy(avatar_form, 'image');
	// BANNER
	const {
		form: banner_form,
		enhance: banner_enhance,
		delayed: banner_delayed,
		submit: banner_submit
	} = superForm(meta.banner_form, {
		id: 'updateClubBanner',
		applyAction: true,
		validators: zod(newImageSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			switch (result.type) {
				case 'success':
					if ($modal[0].response) $modal[0].response(true);
					modal.close();
					break;
			}
		}
	});
	const banner_file = fileProxy(banner_form, 'image');
	// meta
	const club_superform = superForm(meta.club_form, {
		id: 'updateClub',
		applyAction: true,
		validators: zod(newClubSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult: async ({ result }) => {
			switch (result.type) {
				case 'success':
					if ($modal[0].response) $modal[0].response(true);
					modal.close();
					break;
			}
		}
	});
	const {
		form: club_form,
		errors: club_errors,
		constraints: club_constraints,
		enhance: club_enhance,
		delayed: club_delayed,
		submit: club_submit
	} = club_superform;
</script>

{#if $modal[0] && $page.data.user}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}><h1>Update Club</h1></header>
		<div class="card">
			<div class="card-header relative h-[30vh] overflow-hidden group">
				<form
					id="updateClubBanner"
					enctype="multipart/form-data"
					method="POST"
					action="?/updateClubBanner"
					use:banner_enhance
					class="w-full h-full"
				>
					{#if meta.club?.bannerFileId}
						<img
							src={`/api/images/${meta.club?.bannerFileId}`}
							class="object-cover rounded-none overflow-hidden w-full group-hover:hidden"
							alt="Club Banner"
						/>
					{:else}
						<div
							class="placeholder bg-cover bg-surface-backdrop-token h-full w-full rounded-none group-hover:hidden"
						/>
					{/if}
					<FileDropzone
						type="file"
						name="image"
						accept="image/png, image/jpeg"
						on:change={banner_submit}
						class="w-full h-full hidden group-hover:flex"
						bind:files={$banner_file}
					>
						<svelte:fragment slot="message"
							><strong>Upload</strong> an image</svelte:fragment
						>
					</FileDropzone>
				</form>
			</div>
			<form
				id="updateClub"
				method="POST"
				action="?/updateClub"
				use:club_enhance
			>
				<div
					class="flex flex-row h-24 items-start align-baseline justify-start p-4"
				>
					<div
						class="flex flex-row h-24 -mt-6 items-end align-baseline justify-start px-4"
					>
						<div class="relative group h-36 w-36">
							<form
								id="updateClubAvatar"
								enctype="multipart/form-data"
								method="POST"
								action="?/updateClubAvatar"
								use:avatar_enhance
							>
								{#if meta.club}
									{#if meta.club?.avatarFileId}
										<Avatar
											src={`/api/images/${meta.club?.avatarFileId}`}
											initials={String(meta.club.name).slice(0, 2)}
											width="w-36"
											shadow="shadow-lg"
											rounded="rounded-sm"
											fetchpriority="high"
											loading="eager"
											class="group-hover:hidden"
										/>
									{:else}
										<Avatar
											initials={String(meta.club.name).slice(0, 2)}
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
										on:change={avatar_submit}
										class="w-full h-32 hidden group-hover:flex"
										bind:files={$avatar_file}
									>
										<svelte:fragment slot="message"
											><strong>Upload</strong> an image</svelte:fragment
										>
									</FileDropzone>
								{/if}
							</form>
						</div>

						<h2 class="h2 p-4">
							<TextInput superform={club_superform} field="name" class="h2" />
						</h2>
					</div>
				</div>
				<TextArea superform={club_superform} field="description" />
				<SlideToggle name="private" bind:checked={$club_form.private}
					>Private Club</SlideToggle
				>
			</form>
		</div>
		<div class="modal-footer {parent.regionFooter}">
			<form id="delete" method="POST" action="?/delete">
				<Button
					shadow="shadow-md"
					color="variant-filled-error"
					form="delete"
					type="submit"
					class="btn ">Delete Club</Button
				>
			</form>
			{#if $club_delayed}
				<LoadingIcon />
			{:else}
				<Button
					shadow="shadow-md"
					color="variant-filled-primary"
					form="updateClub"
					type="submit"
					class="btn ">Update</Button
				>
			{/if}
		</div>
	</div>
{/if}
