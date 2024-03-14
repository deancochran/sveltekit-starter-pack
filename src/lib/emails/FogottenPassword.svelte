<script lang="ts">
	import type { passwordResetToken } from '@prisma/client';
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let origin: string;
	export let code: string;
</script>

<Html lang="en">
	<Text>Hello, User!</Text>
	<Hr />
	<Text>Reset your password with this code: {code}</Text>
	<Button href="{origin}/forgot-password">Reset Password</Button>
</Html>
