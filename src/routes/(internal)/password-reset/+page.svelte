<script lang="ts">
	import type { PageData } from './$types';
	import ResendPassResetForm from '$lib/forms/ResendPassResetForm.svelte';
	export let data: PageData;
</script>

<ResendPassResetForm form_data={data.resendPassResetForm} />
