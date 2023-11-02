<script lang="ts">
	import { reset_forgot_pass_schema, type ResetForgotPassSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<ResetForgotPassSchema>;
	import { focusTrap } from '@skeletonlabs/skeleton';
	import PasswordInput from './inputs/PasswordInput.svelte';

	const { form, errors, constraints, enhance } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: reset_forgot_pass_schema
	});
	let isFocused: boolean = true;
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
			<PasswordInput
				name="password"
				label="Password"
				bind:value={$form.password}
				errors={$errors.password}
				constraints={$constraints.password}
			/>
			<PasswordInput
				name="val_password"
				label="Password"
				bind:value={$form.val_password}
				errors={$errors.val_password}
				constraints={$constraints.val_password}
			/>
		</form>
	</section>
	<footer class="card-footer">
		<button form="reset_forgot" type="submit" class="btn variant-filled-primary">Submit</button>
	</footer>
</div>
