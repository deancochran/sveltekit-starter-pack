<script lang="ts">
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import { emailVerificationToken } from '$lib/drizzle/schema';
	import type { InferInsertModel } from 'drizzle-orm';
	import { Head, Hr, Html, Preview, Text } from 'svelte-email';

	export let _emailVerificationToken: InferInsertModel<
		typeof emailVerificationToken
	>;
</script>

<Html lang="en">
	<Head />
	<Preview preview="A change in your account email has been made" />
	<Hr />
	<Text
		>Verify your change of email with this code: {_emailVerificationToken.code}</Text
	>
</Html>
<LoadingIcon />
