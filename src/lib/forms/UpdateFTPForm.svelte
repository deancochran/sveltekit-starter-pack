<script lang="ts">
	import { update_ftp_hr_schema, type UpdateFTP_HRSchema } from '$lib/schemas';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import Button from '$lib/components/Button.svelte';
	import SwimFtpInput from './inputs/customInputs/SwimFTPInput.svelte';
	import BikeFtpInput from './inputs/customInputs/BikeFTPInput.svelte';
	import RunFtpInput from './inputs/customInputs/RunFTPInput.svelte';
	import MaxHrInput from './inputs/customInputs/MaxHrInput.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	export let form_data: SuperValidated<Infer<UpdateFTP_HRSchema>>;

	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		id: 'updateFTPHR',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: zod(update_ftp_hr_schema),
		delayMs: 0,
		timeoutMs: 8000
	});
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
			<MaxHrInput
				name="max_hr"
				label="Max HR"
				max={220}
				min={25}
				step={1}
				bind:value={$form.max_hr}
				errors={$errors.max_hr}
				constraints={$constraints.max_hr}
			/>
			<SwimFtpInput
				name="swim_ftp"
				label="Swim FTP"
				max={240}
				min={30}
				step={1}
				bind:value={$form.swim_ftp}
				errors={$errors.swim_ftp}
				constraints={$constraints.swim_ftp}
			/>
			<BikeFtpInput
				name="bike_ftp"
				label="Bike FTP"
				max={500}
				min={100}
				step={1}
				bind:value={$form.bike_ftp}
				errors={$errors.bike_ftp}
				constraints={$constraints.bike_ftp}
			/>
			<RunFtpInput
				name="run_ftp"
				label="Run FTP"
				max={480}
				min={180}
				step={1}
				bind:value={$form.run_ftp}
				errors={$errors.run_ftp}
				constraints={$constraints.run_ftp}
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
				form="updateFTPHR"
				type="submit"
				class="btn ">Update</Button
			>
		{/if}
	</footer>
</div>
