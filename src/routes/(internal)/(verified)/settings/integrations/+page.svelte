<script lang="ts">
	import { PUBLIC_STRAVA_CLIENT_ID, PUBLIC_CANONICAL_URL } from '$env/static/public';
	import { userHasStravaIntegration } from '$lib/utils/integrations/strava/utils';

</script>

<div class="page-container">
	{#await userHasStravaIntegration()}
		loading...
	{:then res}
		{#if res.exists}
			<p>User is already integrated</p>
		{:else}
			<a
				type="button"
				class="btn btn-md"
				href="http://www.strava.com/oauth/authorize?client_id={PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri={PUBLIC_CANONICAL_URL}/api/integrations/strava/authorize&approval_prompt=force&scope=read,activity:read"
				>Authorization for Strava</a
			>
		{/if}
	{/await}
</div>
