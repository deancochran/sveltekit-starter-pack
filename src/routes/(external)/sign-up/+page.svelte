<script lang="ts">
	import SignUpForm from '$lib/forms/SignUpForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<SignUpForm form_data={data.signupForm} />
