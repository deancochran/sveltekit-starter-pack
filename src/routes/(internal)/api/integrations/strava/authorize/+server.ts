import { getTokenFromAuthCode, type StravaOAuth } from '$lib/utils/integrations/strava/auth';
import { ThirdPartyIntegrationProvider } from '@prisma/client';
import type { Session } from 'lucia';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event) {
	const { locals, url } = event;
	const session: Session = await locals.auth.validate();
	let t: ToastSettings;
	if (url.searchParams.has('error')) {
		t = {
			message: 'Case 1 Failed to create strava integration',
			background: 'variant-filled-error'
		} as const;
		throw redirect('/settings', t, event);
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
			throw redirect('/settings', t, event);
		}
		try {
			const token_obj: StravaOAuth = await getTokenFromAuthCode(code);
			const integration = await prisma.thirdPartyIntegrationToken.findFirst({
				where: {
					AND: [
						{ user_id: session.user.userId },
						{ provider: ThirdPartyIntegrationProvider.STRAVA }
					]
				}
			});
			if (integration) {
				await prisma.thirdPartyIntegrationToken.update({
					data: {
						expires_at: token_obj.expires_at,
						expires_in: token_obj.expires_in,
						access_token: token_obj.access_token,
						refresh_token: token_obj.refresh_token
					},
					where: {
						id: integration?.id
					}
				});
			} else {
				await prisma.thirdPartyIntegrationToken.create({
					data: {
						user_id: session.user.userId,
						provider: ThirdPartyIntegrationProvider.STRAVA,
						expires_at: token_obj.expires_at,
						expires_in: token_obj.expires_in,
						access_token: token_obj.access_token,
						refresh_token: token_obj.refresh_token
					}
				});
			}
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
		throw redirect('/settings', t, event);
	} else {
		t = {
			message: 'Case 4 Failed to create strava integration',
			background: 'variant-filled-error'
		} as const;
		throw redirect('/settings', t, event);
	}
}
