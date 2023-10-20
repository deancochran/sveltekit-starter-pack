<script lang="ts">
	import { signup_schema, type SignUpSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<SignUpSchema>;
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import Link from '$lib/components/Link.svelte';

	const { form, errors, constraints, enhance } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: signup_schema
	});
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Sign Up</h1>
	</header>
	<section class="p-4">
		<form id="signup" use:focusTrap={isFocused} method="POST" action="?/signup" use:enhance>
			<EmailInput
				name="email"
				label="Email"
				bind:value={$form.email}
				errors={$errors.email}
				constraints={$constraints.email}
			/>
			<TextInput
				name="username"
				label="Username"
				bind:value={$form.username}
				errors={$errors.username}
				constraints={$constraints.username}
			/>
			<PasswordInput
				name="password"
				label="Password"
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
	<footer class="card-footer">
		<button form="signup" type="submit" class="btn variant-filled-primary">Sign Up</button>
		<Link class="btn variant-soft-secondary" href="/sign-in">Sign-In to your Account</Link>
	</footer>
</div>
