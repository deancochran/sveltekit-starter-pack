import type { ToastSettings } from '@skeletonlabs/skeleton';
import type { RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export function handleSignInRedirect(
	event: RequestEvent,
	message: string = 'You must be logged in to view this page'
): string {
	const t: ToastSettings = {
		message: message,
		background: 'variant-filled-warning'
	} as const;
	setFlash(t, event);
	const fromUrl = event.url.pathname + event.url.search;
	return `/sign-in?redirectTo=${fromUrl}`;
}
