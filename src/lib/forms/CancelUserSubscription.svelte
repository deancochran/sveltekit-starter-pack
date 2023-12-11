<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import PasswordInput from './inputs/PasswordInput.svelte';
	import { AlertCircle } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import { cancel_user_subscription_schema, type CancelUserSubscription } from '$lib/schemas';

	export let form_data: SuperValidated<CancelUserSubscription>;

	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		id: 'cancelSubscription',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: cancel_user_subscription_schema,
		delayMs: 0,
		timeoutMs: 8000
	});
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Cancel Your Subscription</h1>
	</header>
	<section class="p-4 space-y-4">
		<aside class="alert variant-ghost-warning p-4">
			<div class="inline-flex space-x-2">
				<AlertCircle />
				<h3 class="h3 font-bold flex-inline">Warning</h3>
			</div>
			<div class="alert-message">
				<p>
					Canceling your subscription will cause an immediate stop to all your subscriber
					privileges.
				</p>
			</div>
		</aside>
		<form
			id="cancelSubscription"
			use:focusTrap={isFocused}
			method="POST"
			action="/settings/?/cancelSubscription"
			use:enhance
		>
			<PasswordInput
				name="password"
				label="Password"
				bind:value={$form.password}
				errors={$errors.password}
				constraints={$constraints.password}
			/>
		</form>
	</section>
	<footer class="w-full card-footer flex items-end align-middle justify-end gap-2">
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button
				shadow="shadow-md"
				color="variant-filled-primary"
				form="cancelSubscription"
				type="submit"
				class="btn">Cancel Subscription</Button
			>
		{/if}
	</footer>
</div>
