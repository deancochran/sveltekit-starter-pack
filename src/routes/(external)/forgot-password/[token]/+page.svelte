<script lang="ts">
	import type { PageData } from './$types';
	import PassResetForm from '$lib/forms/PassResetForm.svelte';
	import ForgotPassResetForm from '$lib/forms/ForgotPassResetForm.svelte';
	export let data: PageData;
</script>

<ForgotPassResetForm form_data={data.resetForgotPassForm} />
