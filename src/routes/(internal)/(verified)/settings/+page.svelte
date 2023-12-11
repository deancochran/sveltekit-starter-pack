<script lang="ts">
	import CancelUserSubscription from '$lib/forms/CancelUserSubscription.svelte';

	import DeleteUserForm from '$lib/forms/DeleteUserForm.svelte';
	import UpdateUserEmailForm from '$lib/forms/UpdateUserEmailForm.svelte';
	import UpdateUserPasswordForm from '$lib/forms/UpdateUserPasswordForm.svelte';
	import UpdateUserProfileForm from '$lib/forms/UpdateUserProfileForm.svelte';
	export let data;
</script>

<div class="page-container">
	<div class="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
		<div class="card p-4 flex-col gap-2 flex items-center justify-center align-middle">
			<h1 class="h1 font-serif">Settings Page</h1>
		</div>
		<UpdateUserProfileForm form_data={data.updateUserForm} />
		<UpdateUserEmailForm
			form_data={data.updateUserEmailForm}
			send_new_user_email_code_form_data={data.sendNewUserEmailCodeForm}
		/>
		<UpdateUserPasswordForm form_data={data.updateUserEmailPasswordForm} />
		<CancelUserSubscription form_data={data.cancelUserSubscriptionForm} />
		<DeleteUserForm form_data={data.deleteUserForm} />
	</div>
</div>
