<script lang="ts">
	import ForgotPassForm from '$lib/forms/ForgotPassForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<ForgotPassForm form_data={data.forgotPassForm}/>
