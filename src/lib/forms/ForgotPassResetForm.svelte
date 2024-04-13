<script lang="ts">
	import { reset_forgot_pass_schema, type ResetForgotPassSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<Infer<ResetForgotPassSchema>>;
	import { focusTrap } from '@skeletonlabs/skeleton';
	import PasswordInput from './inputs/PasswordInput.svelte';
	import Button from '$lib/components/Button.svelte';
	import TextInput from './inputs/TextInput.svelte';
	import { zod } from 'sveltekit-superforms/adapters';

	const { form, errors, constraints, enhance } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(reset_forgot_pass_schema)
	});
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Reset Password</h1>
	</header>
	<section class="p-4">
		<form
			id="reset_forgot"
			use:focusTrap={isFocused}
			method="POST"
			action="?/reset_forgot"
			use:enhance
		>
			<TextInput
				name="code"
				label="Password Reset Code"
				bind:value={$form.code}
				errors={$errors.code}
				constraints={$constraints.code}
			/>
			<PasswordInput
				name="password"
				label="New Password"
				bind:value={$form.password}
				errors={$errors.password}
				constraints={$constraints.password}
			/>
			<PasswordInput
				name="val_password"
				label="Verify Password"
				bind:value={$form.val_password}
				errors={$errors.val_password}
				constraints={$constraints.val_password}
			/>
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		<Button shadow="shadow-md" color="variant-filled-primary" form="reset_forgot" type="submit"
			>Submit</Button
		>
	</footer>
</div>
