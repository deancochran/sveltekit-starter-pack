<script lang="ts">
	import { forgot_pass_schema, type ForgotPassSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<Infer<ForgotPassSchema>>;
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import InputLabel from './inputs/InputLabel.svelte';

	const superform = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(forgot_pass_schema)
	});
	const { form, errors, constraints, enhance, delayed } = superform;
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Forgotten Password?</h1>
	</header>
	<section class="p-4">
		<form id="forgot" use:focusTrap={isFocused} method="POST" action="?/forgot" use:enhance>
			<InputLabel label="Email">
				<EmailInput {superform} field="email" />
			</InputLabel>
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
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
