<script lang="ts">
	import { signin_schema, type SignInSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<Infer<SignInSchema>>;
	import EmailInput from '$lib/forms/inputs/EmailInput.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import Link from '$lib/components/Link.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';

	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(signin_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	let isFocused: boolean = false;
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
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button
				shadow="shadow-md"
				color="variant-filled-primary"
				form="signin"
				type="submit"
				class="btn">Sign In</Button
			>
		{/if}
		<Link
			label={'Create An Account'}
			shadow="shadow-md"
			color="variant-soft-secondary"
			href="/sign-up">Sign Up</Link
		>
		<Link
			label={'Forgot your password?'}
			shadow="shadow-md"
			color="variant-soft-tertiary"
			href="/forgot-password">Forgot your password?</Link
		>
	</footer>
</div>
