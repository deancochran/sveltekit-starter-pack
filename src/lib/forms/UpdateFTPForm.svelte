<script lang="ts">
	import { update_ftp_hr_schema, type UpdateFTP_HRSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import InputLabel from './inputs/InputLabel.svelte';
	import RangeInput from './inputs/RangeInput.svelte';
	export let form_data: SuperValidated<Infer<UpdateFTP_HRSchema>>;

	const superform = superForm(form_data, {
		id: 'updateFTPHR',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(update_ftp_hr_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
	const { enhance, delayed } = superform;
	let isFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>FTP and Heart Rate Settings</h1>
	</header>
	<section class="p-4">
		<form
			id="updateFTPHR"
			use:focusTrap={isFocused}
			method="POST"
			action="/settings/?/updateFTPHR"
			use:enhance
		>
			<InputLabel label="Max HR">
				<RangeInput {superform} field="max_hr" />
			</InputLabel>
			<InputLabel label="Swim FTP (m/s)">
				<RangeInput {superform} field="swim_ftp" />
			</InputLabel>
			<InputLabel label="Bike FTP (watts)">
				<RangeInput {superform} field="bike_ftp" />
			</InputLabel>
			<InputLabel label="Run FTP (m/s)">
				<RangeInput {superform} field="run_ftp" />
			</InputLabel>
		</form>
	</section>
	<footer class="w-full card-footer flex flex-wrap items-end align-middle justify-end gap-2">
		{#if $delayed}
			<LoadingIcon />
		{:else}
			<Button
				shadow="shadow-md"
				color="variant-filled-primary"
				form="updateFTPHR"
				type="submit"
				class="btn ">Update</Button
			>
		{/if}
	</footer>
</div>
