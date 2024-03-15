<script lang="ts">
	import { update_user_schema, type UpdateUserSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import TextInput from './inputs/TextInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	export let form_data: SuperValidated<Infer<UpdateUserSchema>>;

	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		id: 'updateUser',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(update_user_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
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
			<TextInput
				name="username"
				label="Username"
				bind:value={$form.username}
				errors={$errors.username}
				constraints={$constraints.username}
			/>
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
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
