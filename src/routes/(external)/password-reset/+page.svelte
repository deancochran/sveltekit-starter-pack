<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageData } from "./$types";
	export let data:PageData

</script>

<h1>Reset Password</h1>




<h1>Hey {data.user.username}, want to reset your password?</h1>
<h2>Send Password Reset Link to {data.user.email}</h2>
<form method="post" action="?/resend" use:enhance>
	<input type="submit" value="Send Reset Link" />
</form>