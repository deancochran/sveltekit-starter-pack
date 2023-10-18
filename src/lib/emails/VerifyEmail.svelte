<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';

	export let origin: string;
	export let token: string;
</script>

<Html lang="en">
	<Text>Hello, New User!</Text>
	<Hr />
	<!-- <Button >Visit Svelte</Button> -->
	<Button href="{origin}/verify-email/{token}">Verify Email</Button>
</Html>
