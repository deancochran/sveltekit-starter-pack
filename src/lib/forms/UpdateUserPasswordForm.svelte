<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import {
		updateUserPasswordSchema,
		type UpdateUserPasswordSchema
	} from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import PasswordInput from './inputs/PasswordInput.svelte';

	export let form_data: SuperValidated<Infer<UpdateUserPasswordSchema>>;

	const superform = superForm(form_data, {
		id: 'updateUserPassword',
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(updateUserPasswordSchema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { form, errors, constraints, enhance, delayed } = superform;
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Update Password</h1>
	</header>
	<section class="p-4">
		<form
			id="updateUserPassword"
			use:focusTrap={isFocused}
			method="POST"
			action="/settings/?/updateUserPassword"
			use:enhance
		>
			<PasswordInput {superform} field="password" />
			<PasswordInput {superform} field="valPassword" />
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
				form="updateUserPassword"
				type="submit"
				class="btn ">Update</Button
			>
		{/if}
	</footer>
</div>
