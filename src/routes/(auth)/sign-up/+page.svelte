<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { signupSchema } from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	export let data: PageData;
	const superform = superForm(data.signupForm, {
		id: 'signup',
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(signupSchema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { form, enhance } = superform;
	let isFocused: boolean = true;
</script>

<div class="page-container">
	<div class="card">
		<header class="card-header flex justify-center">
			<h1>Sign Up</h1>
		</header>
		<section class="p-4">
			<form
				id="signup"
				name="signup"
				use:focusTrap={isFocused}
				method="POST"
				action="?/signup"
				use:enhance
			>
				<InputLabel label="Email">
					<EmailInput {superform} field="email" />
				</InputLabel>

				<InputLabel label="Username">
					<TextInput {superform} field="username" />
				</InputLabel>

				<InputLabel label="Password">
					<PasswordInput {superform} field="password" />
				</InputLabel>

				<InputLabel label="Verify Password">
					<PasswordInput {superform} field="valPassword" />
				</InputLabel>
			</form>
		</section>
		<footer
			class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2"
		>
			<Button
				class="btn variant-filled-primary"
				shadow="shadow-md"
				color="variant-filled-primary"
				form="signup"
				type="submit">Sign Up</Button
			>
			<Link
				label={'Sign In to your Account'}
				shadow="shadow-md"
				color="variant-soft-secondary"
				href="/sign-in">Sign In</Link
			>
		</footer>
	</div>
</div>
