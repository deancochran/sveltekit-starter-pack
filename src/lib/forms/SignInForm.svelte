<script lang="ts">
	import { signin_schema, type SignInSchema } from '$lib/forms/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<SignInSchema>;
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';

	const { form, errors, constraints, enhance } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: signin_schema
	});
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Sign In</h1>
	</header>
	<section class="p-4">
		<form id="signin" use:focusTrap={isFocused} method="POST" action="?/signin" use:enhance>
			<EmailInput
				name="email"
				label="Email"
				bind:value={$form.email}
				errors={$errors.email}
				constraints={$constraints.email}
			/>
			<PasswordInput
				name="password"
				label="Password"
				bind:value={$form.password}
				errors={$errors.password}
				constraints={$constraints.password}
			/>
		</form>
	</section>
	<footer class="card-footer">
		<button form="signin" type="submit" class="btn variant-filled-primary">Sign In</button>
	</footer>
</div>
