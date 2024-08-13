<script lang="ts">
	import Button from '../Button.svelte';
</script>

<div class="card">
	<div class=" card-header">This user would like to follow you. Do you accept?</div>
	<form method="POST" name="handle_friendship">
		<Button color="variant-ghost-surface" formaction="?/accept" type="submit" class="btn"
			>Accpet</Button
		>
		<Button color="variant-ghost-surface" formaction="?/decline" type="submit" class="btn"
			>Decline</Button
		>
	</form>
</div>
