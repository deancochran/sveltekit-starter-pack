<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Email verification</h1>

<h1>{data.user.username}, Your email verification link was sent to your inbox (i.e. console).</h1>
<h2>Resend verification link</h2>
<form method="post" action="?/resend" use:enhance>
	<input type="submit" value="Resend" />
</form>
