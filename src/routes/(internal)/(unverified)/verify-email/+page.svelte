<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import SendEmailVerificationLinkForm from '$lib/forms/SendEmailVerificationLinkForm.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { verify_user_email_schema } from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { zod } from 'sveltekit-superforms/adapters';
	export let data: PageData;

	const { form, errors, constraints, enhance, delayed } = superForm(data.verifyEmailForm, {
		id: 'updateUser',
		applyAction: true,
		invalidateAll: false,
		resetForm: true,
		validators: zod(verify_user_email_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	let isFocused: boolean = false;
</script>

<div class="page-container">
	<form id="verify" use:focusTrap={isFocused} method="POST" action="?/verify" use:enhance>
		<h1>Submit Your Code</h1>
		<div class="relative flex space-x-4 flex-row h-full">
			<TextInput
				name="code"
				label="code"
				bind:value={$form.code}
				errors={$errors.code}
				constraints={$constraints.code}
			/>

			<div class="flex items-center justify-center">
				{#if $delayed}
					<div class="flex items-center justify-center mt-6">
						<LoadingIcon />
					</div>
				{/if}
			</div>
		</div>
	</form>

	<form id="verify" method="post" action="?/verify" use:enhance>
		<Button
			shadow="shadow-md"
			color="variant-filled-primary"
			form="verify"
			type="submit"
			class="btn">submit</Button
		>
	</form>

	<br />
	<SendEmailVerificationLinkForm />
</div>
