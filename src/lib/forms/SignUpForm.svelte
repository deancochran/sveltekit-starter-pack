<script lang="ts">
	import { signup_schema, type SignUpSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<Infer<SignUpSchema>>;
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import Link from '$lib/components/Link.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';

	const superform = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(signup_schema),
		timeoutMs: 8000
	});
	const { enhance } = superform;
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Sign Up</h1>
	</header>
	<section class="p-4">
		<form id="signup" use:focusTrap={isFocused} method="POST" action="?/signup" use:enhance>
			<EmailInput {superform} field="email" />
			<TextInput {superform} field="username" />
			<PasswordInput {superform} field="password" />
			<PasswordInput {superform} field="val_password" />
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		<Button
			shadow="shadow-md"
			color="variant-filled-primary"
			form="signup"
			type="submit"
			class="btn variant-filled-primary">Sign Up</Button
		>
		<Link
			label={'Sign In to your Account'}
			shadow="shadow-md"
			color="variant-soft-secondary"
			href="/login">Sign In</Link
		>
	</footer>
</div>
