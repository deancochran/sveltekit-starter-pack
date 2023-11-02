<script lang="ts">
	import ResendPassResetForm from '$lib/forms/ResendPassResetForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="page-container">
	<ResendPassResetForm form_data={data.resendPassResetForm} />
</div>
