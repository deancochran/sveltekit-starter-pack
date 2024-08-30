<script lang="ts">
	import { page } from '$app/stores';
	import {
		PUBLIC_STRAVA_CLIENT_ID,
		PUBLIC_WAHOO_CLIENT_ID
	} from '$env/static/public';
	export let provider: 'STRAVA' | 'WAHOO';

	function titleCase(provider: 'STRAVA' | 'WAHOO') {
		return provider[0].toUpperCase() + provider.slice(1).toLowerCase();
	}
	function getHref(provider: 'STRAVA' | 'WAHOO') {
		switch (provider) {
			case 'STRAVA':
				return `https://www.strava.com/oauth/authorize?client_id=${PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${$page.url.origin}/api/integrations/strava/authorize&response_type=code&approval_prompt=force&scope=read,activity:read_all`;
			case 'WAHOO':
				return `https://api.wahooligan.com/oauth/authorize?client_id=${PUBLIC_WAHOO_CLIENT_ID}&redirect_uri=${$page.url.origin}/api/integrations/wahoo/authorize&response_type=code&scope=workouts_read+workouts_write+plans_read+plans_write+power_zones_read+offline_data+user_read`;
			default:
				return '';
		}
	}
	$: title = titleCase(provider as 'STRAVA' | 'WAHOO');
	$: href = getHref(provider as 'STRAVA' | 'WAHOO');
</script>

<a
	{href}
	class="logo-item variant-ghost-primary"
	data-sveltekit-preload-data="hover">Connect to {title}</a
>
