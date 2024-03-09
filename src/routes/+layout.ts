import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {

	const platform = browser && window.navigator.platform
	return {platform, ...event.data};
};
