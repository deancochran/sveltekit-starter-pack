<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { Button, Head, Hr, Html, Preview } from 'svelte-email';
	export let origin: string;
	export let token: string;
</script>

<Html lang="en">
	<Head />
	<Preview preview="Hello, New User!" />
	<Hr />
	<Button href="{origin}/verify-email/{token}">Verify Email</Button>
</Html>
<LoadingIcon />
