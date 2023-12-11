<script lang="ts">
	import { resend_reset_pass_schema, type ResendResetPassSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<ResendResetPassSchema>;
	import { focusTrap } from '@skeletonlabs/skeleton';
	import Button from '$lib/components/Button.svelte';

	const { enhance } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: resend_reset_pass_schema
	});
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Resend Password Reset Link</h1>
	</header>
	<section class="p-4">
		<form id="resend" use:focusTrap={isFocused} method="POST" action="?/resend" use:enhance />
	</section>
	<footer class="w-full card-footer flex items-end align-middle justify-end gap-2">
		<Button
			shadow="shadow-md"
			color="variant-filled-primary"
			form="resend"
			type="submit"
			class="btn ">Submit</Button
		>
	</footer>
</div>
