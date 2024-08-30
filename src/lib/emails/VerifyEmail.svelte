<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { emailVerificationToken } from '$lib/drizzle/schema';
	import type { InferSelectModel } from 'drizzle-orm';
	import { Head, Hr, Html, Preview, Text } from 'svelte-email';
	export let token: InferSelectModel<typeof emailVerificationToken>;
</script>

<Html lang="en">
	<Head />
	<Preview preview="Hello, New User!" />
	<Hr />
	<Text>Verify your email with this code: {token.code}</Text>
</Html>
<LoadingIcon />
