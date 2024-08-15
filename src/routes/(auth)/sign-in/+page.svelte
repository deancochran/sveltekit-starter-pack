<script lang="ts">
	import SignInForm from '$lib/forms/SignInForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="page-container">
	<SignInForm form_data={data.signinForm} />
</div>
