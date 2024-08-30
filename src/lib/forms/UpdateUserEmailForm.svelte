<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import {
		sendNewUserEmailCodeSchema,
		updateUserEmailSchema,
		type SendNewUserEmailCode,
		type UpdateUserEmailSchema
	} from '$lib/schemas';
	import { focusTrap, Step, Stepper } from '@skeletonlabs/skeleton';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms/client';
	import EmailInput from './inputs/EmailInput.svelte';
	import TextInput from './inputs/TextInput.svelte';

	export let form_data: SuperValidated<Infer<UpdateUserEmailSchema>>;
	export let send_new_user_email_code_form_data: SuperValidated<
		Infer<SendNewUserEmailCode>
	>;
	$: successfullySentCode = false;
	$: lock_verify_code = !successfullySentCode;

	const superform = superForm(form_data, {
		id: 'updateUserEmailForm',
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(updateUserEmailSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result, formEl, cancel } = event;
			if (result.type == 'success') {
				invalidateAll();
			}
			return;
		}
	});
	const { form, errors, constraints, enhance, delayed } = superform;
	let isFocused: boolean = false;

	const {
		form: SendNewUserEmailCodeForm,
		errors: SendNewUserEmailCodeErrors,
		constraints: SendNewUserEmailCodeConstraints,
		enhance: SendNewUserEmailCodeEnhance,
		delayed: SendNewUserEmailCodeDelayed
	} = superForm(send_new_user_email_code_form_data, {
		id: 'sendUserEmailCode',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(sendNewUserEmailCodeSchema),
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result, formEl, cancel } = event;
			if (result.type == 'success') {
				form.set({ email: result.data?.form.data.email, code: '' });
				successfullySentCode = true;
			} else {
				successfullySentCode = false;
			}

			return;
		}
	});
	let isSendEmailFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Change Your Email</h1>
	</header>
	<section class="p-4">
		<Stepper>
			<Step bind:locked={lock_verify_code}>
				<svelte:fragment slot="header">Enter Your New Email</svelte:fragment>
				<form
					id="sendUserEmailCode"
					use:focusTrap={isSendEmailFocused}
					method="POST"
					action="/settings/?/sendUserEmailCode"
					use:SendNewUserEmailCodeEnhance
					class="flex flex-row"
				>
					<EmailInput {superform} field="email" />

					{#if $SendNewUserEmailCodeDelayed}
						<div class="flex items-center justify-center mt-6">
							<LoadingIcon />
						</div>
					{:else}
						<Button
							shadow="shadow-md"
							color="variant-filled-primary"
							form="sendUserEmailCode"
							type="submit"
							class="btn mt-7">Send Code</Button
						>
					{/if}
				</form>
				<svelte:fragment slot="navigation">
					<br />
				</svelte:fragment>
			</Step>
			<form
				id="updateUserEmail"
				use:focusTrap={isFocused}
				method="POST"
				action="/settings/?/updateUserEmail"
				use:enhance
			>
				<Step buttonCompleteLabel="Update Email" buttonCompleteType="submit">
					<svelte:fragment slot="header">Submit Your Code</svelte:fragment>
					<input hidden={true} name="email" bind:value={$form.email} />
					<div class="relative flex space-x-4 flex-row h-full">
						<TextInput {superform} field="code" />

						<div class="flex items-center justify-center">
							{#if $delayed}
								<div class="flex items-center justify-center mt-6">
									<LoadingIcon />
								</div>
							{/if}
						</div>
					</div>
				</Step>
			</form>
		</Stepper>
	</section>
</div>
