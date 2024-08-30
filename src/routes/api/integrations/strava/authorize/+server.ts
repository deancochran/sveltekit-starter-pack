import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import {
	getTokenFromAuthCode,
	type StravaOAuth
} from '$lib/integrations/strava/auth';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event: RequestEvent) {
	const { locals, url } = event;
	let t: ToastSettings;
	if (url.searchParams.has('error')) {
		t = {
			message: 'Case 1 Failed to create strava integration',
			background: 'variant-filled-error'
		} as const;
		redirect('/settings', t, event);
	}
	const scope = url.searchParams.get('scope');
	const code = url.searchParams.get('code');
	if (code && scope) {
		// verify scope
		if (scope !== 'read,activity:read') {
			t = {
				message: 'Case 2 Failed to create strava integration',
				background: 'variant-filled-error'
			} as const;
			redirect('/settings', t, event);
		}
		try {
			const tokenObj: StravaOAuth = await getTokenFromAuthCode(code);
			const timestampInMilliseconds = tokenObj.expires_at * 1000;
			await db
				.insert(thirdPartyIntegrationToken)
				.values({
					userId: locals.user!.id,
					integrationId: String(tokenObj.athlete.id),
					provider: 'STRAVA',
					expiresAt: new Date(timestampInMilliseconds),
					accessToken: tokenObj.access_token,
					refreshToken: tokenObj.refresh_token,
					updatedAt: new Date()
				})
				.onConflictDoUpdate({
					target: thirdPartyIntegrationToken.integrationId,
					set: {
						integrationId: String(tokenObj.athlete.id),
						expiresAt: new Date(timestampInMilliseconds),
						accessToken: tokenObj.access_token,
						refreshToken: tokenObj.refresh_token,
						updatedAt: new Date()
					}
				});

			t = {
				message: 'Successfully created strava integration',
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			t = {
				message: 'Case 3 Failed to create strava integration',
				background: 'variant-filled-error'
			} as const;
		}
		redirect('/settings', t, event);
	} else {
		t = {
			message: 'Case 4 Failed to create strava integration',
			background: 'variant-filled-error'
		} as const;
		redirect('/settings', t, event);
	}
}
