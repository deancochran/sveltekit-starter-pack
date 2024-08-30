<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { resetForgotPassSchema, signupSchema } from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	export let data: PageData;
	const forgot_superform = superForm(data.forgotPassForm, {
		id: 'forgot',
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(signupSchema),
		timeoutMs: 8000
	});
	const { enhance: forgot_enhance } = forgot_superform;
	let ForgotIsFocused: boolean = true;

	const reset_superform = superForm(data.resetForgotPassForm, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(resetForgotPassSchema)
	});
	const { enhance: reset_enhance } = reset_superform;
	let ResetIsFocused: boolean = false;
</script>

<div class="page-container">
	<div class="card">
		<header class="card-header flex justify-center">
			<h1>Forgotten Password?</h1>
		</header>
		<section class="p-4">
			<form
				id="forgot"
				name="forgot"
				use:focusTrap={ForgotIsFocused}
				method="POST"
				action="?/forgot"
				use:forgot_enhance
			>
				<InputLabel label="Email">
					<TextInput superform={forgot_superform} field="email_or_username" />
				</InputLabel>
			</form>
		</section>
		<footer
			class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2"
		>
			<Button
				label={'Send Reset Link'}
				shadow="shadow-md"
				color="variant-filled-primary"
				form="forgot"
				type="submit"
				class="btn ">Send Reset Password Code</Button
			>
		</footer>
	</div>

	<div class="card">
		<header class="card-header flex justify-center">
			<h1>Reset Password</h1>
		</header>
		<section class="p-4">
			<form
				id="reset_forgot"
				use:focusTrap={ResetIsFocused}
				method="POST"
				action="?/reset_forgot"
				use:reset_enhance
			>
				<InputLabel label="Email">
					<TextInput superform={reset_superform} field="code" />
				</InputLabel>
				<InputLabel label="Password">
					<PasswordInput superform={reset_superform} field="password" />
				</InputLabel>
				<InputLabel label="Verify Password">
					<PasswordInput superform={reset_superform} field="valPassword" />
				</InputLabel>
			</form>
		</section>
		<footer
			class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2"
		>
			<Button
				shadow="shadow-md"
				color="variant-filled-primary"
				form="reset_forgot"
				type="submit">Submit</Button
			>
		</footer>
	</div>
</div>
