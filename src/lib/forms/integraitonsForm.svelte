<script lang="ts">
	import { PUBLIC_STRAVA_CLIENT_ID, PUBLIC_CANONICAL_URL } from '$env/static/public';
	import { userHasStravaIntegration } from '$lib/utils/integrations/strava/utils';
	const href = `http://www.strava.com/oauth/authorize?client_id=${PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${PUBLIC_CANONICAL_URL}/api/integrations/strava/authorize&approval_prompt=force&scope=read,activity:read`;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Integrations</h1>
	</header>
	<section class="p-4 space-y-4">
		<div class="logo-cloud grid-cols-1 gap-1">
			{#await userHasStravaIntegration()}
				<span class="logo-item">
					<span>loading...</span>
				</span>
			{:then res}
				{#if res.exists}
					<span class="logo-item bg-primary-400-500-token">
						<span>Strava Integrated</span>
					</span>
				{:else}
					<a class="logo-item" {href}>
						<span>Connect to Strava</span>
					</a>
				{/if}
			{/await}
		</div>
	</section>
</div>
