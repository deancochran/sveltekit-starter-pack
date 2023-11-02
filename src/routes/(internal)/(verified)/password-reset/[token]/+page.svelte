<script lang="ts">
	import type { PageData } from './$types';
	import PassResetForm from '$lib/forms/PassResetForm.svelte';
	export let data: PageData;
</script>

<div class="page-container">
	<PassResetForm form_data={data.resetPassForm} />
</div>
