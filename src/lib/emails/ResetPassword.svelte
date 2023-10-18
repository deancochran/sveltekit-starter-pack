<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let origin: string;
	export let token: string;
</script>

<Html lang="en">
	<Text>Hello, User!</Text>
	<Hr />
	<!-- <Button >Visit Svelte</Button> -->
	<Button href="{origin}/password-reset/{token}">Reset Password</Button>
</Html>
