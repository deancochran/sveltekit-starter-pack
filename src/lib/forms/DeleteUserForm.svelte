<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { delete_user_schema, type DeleteUserSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import PasswordInput from './inputs/PasswordInput.svelte';
	import { AlertCircle } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';

	export let form_data: SuperValidated<Infer<DeleteUserSchema>>;

	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		id: 'deleteUser',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(delete_user_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
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
					Deleting your account will remove all your personal information from our database. This
					includes any purchased products, services, or subscriptions.
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
			<PasswordInput
				name="password"
				label="Password"
				bind:value={$form.password}
				errors={$errors.password}
				constraints={$constraints.password}
			/>
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button shadow="shadow-md" color="variant-filled-error" form="deleteUser" type="submit"
				>Delete Account</Button
			>
		{/if}
	</footer>
</div>
