<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { Head, Hr, Html, Preview, Text } from 'svelte-email';

	export let token: string;
</script>

<Html lang="en">
	<Head />
	<Preview preview="A change in your account email has been made" />
	<Hr />
	<Text>Verify that your email is valid with this code: {token}</Text>
</Html>
<LoadingIcon />
