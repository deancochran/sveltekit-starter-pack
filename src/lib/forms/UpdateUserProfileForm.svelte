<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { updateUserSchema, type UpdateUserSchema } from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import TextInput from './inputs/TextInput.svelte';
	export let form_data: SuperValidated<Infer<UpdateUserSchema>>;

	const superform = superForm(form_data, {
		id: 'updateUser',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(updateUserSchema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { form, errors, constraints, enhance, delayed } = superform;
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Profile Settings</h1>
	</header>
	<section class="p-4">
		<form
			id="updateUser"
			use:focusTrap={isFocused}
			method="POST"
			action="/settings/?/updateUser"
			use:enhance
		>
			<TextInput {superform} field="username" />
		</form>
	</section>
	<footer
		class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2"
	>
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button
				shadow="shadow-md"
				color="variant-filled-primary"
				form="updateUser"
				type="submit"
				class="btn ">Update</Button
			>
		{/if}
	</footer>
</div>
