<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Link from '$lib/components/Link.svelte';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import InputLabel from '$lib/forms/inputs/InputLabel.svelte';
	import PasswordInput from '$lib/forms/inputs/PasswordInput.svelte';
	import TextInput from '$lib/forms/inputs/TextInput.svelte';
	import { signinSchema } from '$lib/schemas';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { PageData } from './$types';
	export let data: PageData;

	const superform = superForm(data.signinForm, {
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: zod(signinSchema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { enhance, delayed } = superform;
	let isFocused: boolean = false;
</script>

<div class="page-container">
	<div class="card">
		<header class="card-header flex justify-center">
			<h1>Sign In</h1>
		</header>
		<section class="p-4">
			<form
				id="signin"
				use:focusTrap={isFocused}
				method="POST"
				action="?/signin"
				use:enhance
			>
				<InputLabel label="Username or Email">
					<TextInput {superform} field="email_or_username" />
				</InputLabel>
				<InputLabel label="Password">
					<PasswordInput {superform} field="password" />
				</InputLabel>
			</form>
		</section>
		<footer
			class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2"
		>
			{#if $delayed}
				<LoadingIcon />
			{:else}
				<Button
					shadow="shadow-md"
					color="variant-filled-primary"
					form="signin"
					type="submit">Sign In</Button
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
</div>
