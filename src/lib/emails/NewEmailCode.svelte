<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import type { emailVerificationToken } from '@prisma/client';
	import { Head, Hr, Html, Preview, Text } from 'svelte-email';

	export let token: emailVerificationToken;
</script>

<Html lang="en">
	<Head />
	<Preview preview="A change in your account email has been made" />
	<Hr />
	<Text>Verify your change of email with this code: {token.code}</Text>
</Html>
<LoadingIcon />
