<!-- routes/signup/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign In</h1>
<form method="post" action="?/signin" use:enhance>
	<label for="email">Email</label>
	<input type="email" name="email" id="email" /><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<button type="submit">Submit</button>
</form>
