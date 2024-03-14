<script lang="ts">
	import PassResetForm from '$lib/forms/PassResetForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="page-container">
	<PassResetForm form_data={data.resetPassForm} />
</div>
