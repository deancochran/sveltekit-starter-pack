<script lang="ts">
	import { forgot_pass_schema, type ForgotPassSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<ForgotPassSchema>;
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';

	const { form, errors, constraints, enhance, message } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: forgot_pass_schema
	});
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Forgotten Password?</h1>
	</header>
	<section class="p-4">
		<form id="forgot" use:focusTrap={isFocused} method="POST" action="?/forgot" use:enhance>
			<EmailInput
				name="email"
				label="Email"
				bind:value={$form.email}
				errors={$errors.email}
				constraints={$constraints.email}
			/>
		</form>
	</section>
	<footer class="card-footer">
		<button form="forgot" type="submit" class="btn variant-filled-primary">Send Reset Link</button>
	</footer>
</div>
