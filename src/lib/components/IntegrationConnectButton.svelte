<script lang="ts">
	import { PUBLIC_CANONICAL_URL, PUBLIC_STRAVA_CLIENT_ID, PUBLIC_WAHOO_CLIENT_ID, PUBLIC_WAHOO_CLIENT_REDIRECT_URI } from '$env/static/public';
	import type { ThirdPartyIntegrationProvider } from '@prisma/client';
	export let provider: ThirdPartyIntegrationProvider;

	function titleCase(provider: ThirdPartyIntegrationProvider) {
		return provider[0].toUpperCase() + provider.slice(1).toLowerCase();
	}
	function getHref(provider: ThirdPartyIntegrationProvider) {
		switch (provider) {
			case 'STRAVA':
				return `https://www.strava.com/oauth/authorize?client_id=${PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${PUBLIC_CANONICAL_URL}/api/integrations/strava/authorize&response_type=code&approval_prompt=force&scope=read,activity:read`;
			case "WAHOO":
				return `https://api.wahooligan.com/oauth/authorize?client_id=${PUBLIC_WAHOO_CLIENT_ID}&redirect_uri=${PUBLIC_WAHOO_CLIENT_REDIRECT_URI}&response_type=code&scope=workouts_read+workouts_write+plans_read+plans_write+power_zones_read+offline_data+user_read`;
			default:
				return '';
		}
	}
	$: title = titleCase(provider as ThirdPartyIntegrationProvider);
	$: href = getHref(provider as ThirdPartyIntegrationProvider);
</script>

<a {href} class="logo-item variant-ghost-primary" data-sveltekit-preload-data="hover"
	>Connect to {title}</a
>
