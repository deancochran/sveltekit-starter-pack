<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let origin: string;
	export let code: string;
</script>

<Html lang="en">
	<Text>Hello, User!</Text>
	<Hr />
	<Text>Reset your password with this code: {code}</Text>
	<Button href="{origin}/password-reset">Reset Password</Button>
</Html>
