<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import type { emailVerificationToken } from '@prisma/client';
	import { Button, Head, Hr, Html, Preview, Text } from 'svelte-email';
	export let origin: string;
	export let token: emailVerificationToken;
</script>

<Html lang="en">
	<Head />
	<Preview preview="Hello, New User!" />
	<Hr />
	<Text>Verify your email with this code: {token.code}</Text>
	<Button href="{origin}/verify-email/{token.code}">Verify Email</Button>
</Html>
<LoadingIcon />
