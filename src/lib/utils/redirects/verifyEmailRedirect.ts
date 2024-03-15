import type { ToastSettings } from '@skeletonlabs/skeleton';
import type { RequestEvent } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

export function handleVerifyEmailRedirect(
	event: RequestEvent,
	message: string = 'You must verify your email view this page'
): string {
	const t: ToastSettings = {
		message: message,
		background: 'variant-filled-warning'
	} as const;
	setFlash(t, event);
	const fromUrl = event.url.pathname + event.url.search;
	return `/verify-email?redirectTo=${fromUrl}`;
}
