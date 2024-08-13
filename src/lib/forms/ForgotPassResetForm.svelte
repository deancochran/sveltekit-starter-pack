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
	import InputLabel from './inputs/InputLabel.svelte';

	const superform = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(reset_forgot_pass_schema)
	});
	const { form, errors, constraints, enhance } = superform;
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
			<InputLabel label="Email">
				<TextInput {superform} field="code" />
			</InputLabel>
			<InputLabel label="Password">
				<PasswordInput {superform} field="password" />
			</InputLabel>
			<InputLabel label="Verify Password">
				<PasswordInput {superform} field="val_password" />
			</InputLabel>
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		<Button shadow="shadow-md" color="variant-filled-primary" form="reset_forgot" type="submit"
			>Submit</Button
		>
	</footer>
</div>
