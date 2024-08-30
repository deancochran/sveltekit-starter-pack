<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { type DeleteUserSchema, deleteUserSchema } from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { AlertCircle } from 'lucide-svelte';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import InputLabel from './inputs/InputLabel.svelte';
	import PasswordInput from './inputs/PasswordInput.svelte';

	export let form_data: SuperValidated<Infer<DeleteUserSchema>>;

	const superform = superForm(form_data, {
		id: 'deleteUser',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(deleteUserSchema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { form, errors, constraints, enhance, delayed } = superform;
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Delete Your Account</h1>
	</header>
	<section class="p-4 space-y-4">
		<aside class="alert variant-ghost-warning p-4">
			<div class="inline-flex space-x-2">
				<AlertCircle />
				<h3 class="h3 font-bold flex-inline">Warning</h3>
			</div>
			<div class="alert-message">
				<p>
					Deleting your account will remove all your personal information from
					our database. This includes any purchased products, services, or
					subscriptions.
				</p>
			</div>
		</aside>
		<form
			id="deleteUser"
			use:focusTrap={isFocused}
			method="POST"
			action="/settings/?/deleteUser"
			use:enhance
		>
			<InputLabel label="Password">
				<PasswordInput {superform} field="password" />
			</InputLabel>
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
				color="variant-filled-error"
				form="deleteUser"
				type="submit">Delete Account</Button
			>
		{/if}
	</footer>
</div>
