<script lang="ts">
	import { new_club_schema } from '$lib/schemas';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { SlideToggle, focusTrap } from '@skeletonlabs/skeleton';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import TextArea from '$lib/forms/inputs/TextArea.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';

	export let data: PageData;

	// Init form
	let isFocused: boolean = false;
	const superform = superForm(data.clubSchema, {
		id: 'create',
		resetForm: false,
		validators: zod(new_club_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { form, errors, constraints, enhance, delayed } = superform;
</script>

<form id="create" use:focusTrap={isFocused} method="POST" action="?/create" use:enhance>
	<header class="card-header flex flex-col">
		<h1 class="w-full py-2 text-center">New Club</h1>
	</header>

	<section class="p-4">
		<TextInput field="name" {superform} />
		<TextArea field="description" {superform} />
		<SlideToggle name="private" bind:checked={$form.private}>Private Club</SlideToggle>
	</section>
	<footer
		class="w-full card-footer flex flex-row flex-wrap items-end align-middle justify-end gap-2"
	>
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button
				shadow="shadow-md"
				color="variant-filled-primary"
				form="create"
				type="submit"
				class="btn ">Create</Button
			>
		{/if}
	</footer>
</form>
