<script lang="ts">
	import SignUpForm from '$lib/forms/SignUpForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="page-container">
	<SignUpForm form_data={data.signupForm} />
</div>
