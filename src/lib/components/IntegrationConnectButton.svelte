<script lang="ts">
	import { PUBLIC_CANONICAL_URL, PUBLIC_STRAVA_CLIENT_ID } from '$env/static/public';
	import type { ThirdPartyIntegrationProvider } from '@prisma/client';
	export let provider: ThirdPartyIntegrationProvider;

	function titleCase(provider: ThirdPartyIntegrationProvider) {
		return provider[0].toUpperCase() + provider.slice(1).toLowerCase();
	}
	function getHref(provider: ThirdPartyIntegrationProvider) {
		switch (provider) {
			case 'STRAVA':
				return `http://www.strava.com/oauth/authorize?client_id=${PUBLIC_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${PUBLIC_CANONICAL_URL}/api/integrations/strava/authorize&approval_prompt=force&scope=read,activity:read`;
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
