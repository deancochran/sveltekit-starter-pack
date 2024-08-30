<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import DeleteUserForm from '$lib/forms/DeleteUserForm.svelte';
	import IntegrationsForm from '$lib/forms/IntegrationsForm.svelte';
	import UpdateFtpForm from '$lib/forms/UpdateFTPForm.svelte';
	import UpdateUserEmailForm from '$lib/forms/UpdateUserEmailForm.svelte';
	import UpdateUserPasswordForm from '$lib/forms/UpdateUserPasswordForm.svelte';
	import UpdateUserProfileForm from '$lib/forms/UpdateUserProfileForm.svelte';
	import UserAvatarForm from '$lib/forms/UserAvatarForm.svelte';
	import UserBannerForm from '$lib/forms/UserBannerForm.svelte';

	export let data;
</script>

<div class="page-container">
	<div class="mx-auto max-w-2xl space-y-16 sm:space-y-10 lg:mx-0 lg:max-w-none">
		<div class="card">
			<div class="card-header relative h-[30vh] overflow-hidden group">
				<UserBannerForm form_data={data.userBannerForm} />
			</div>
			<div
				class="flex flex-row h-24 items-start align-baseline justify-start px-4"
			>
				<div
					class="flex flex-row h-24 -mt-6 items-end align-baseline justify-start px-12"
				>
					<div class="relative group h-36 w-36">
						<UserAvatarForm form_data={data.userAvatarForm} />
					</div>

					<h2 class="h2 p-4">
						{data.user?.username}
					</h2>
				</div>
			</div>
		</div>

		<IntegrationsForm
			integrations={data.userIntegrations}
			form_data={data.integrationsForm}
		/>
		<UpdateFtpForm form_data={data.updateFTPForm} />
		<UpdateUserProfileForm form_data={data.updateUserForm} />
		<UpdateUserEmailForm
			form_data={data.updateUserEmailForm}
			send_new_user_email_code_form_data={data.sendNewUserEmailCodeForm}
		/>
		<UpdateUserPasswordForm form_data={data.updateUserEmailPasswordForm} />
		<form id="delete" method="POST" action="?/subscriptions" use:enhance>
			<Button
				shadow="shadow-md"
				color="variant-filled-error"
				form="delete"
				type="submit">Update Subscriptions</Button
			>
		</form>
		<DeleteUserForm form_data={data.deleteUserForm} />
	</div>
</div>
