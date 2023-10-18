<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	// export let data:PageData
</script>

<h1>Reset Password</h1>

<form method="post" action="?/reset" use:enhance>
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	<label for="val_password">Verify Password</label>
	<input type="password" name="val_password" id="val_password" /><br />
	<button type="submit">Submit</button>
</form>
