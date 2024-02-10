import { SECRET_STRAVA_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_STRAVA_CLIENT_ID } from '$env/static/public';
import { ThirdPartyIntegrationProvider } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { SummaryAthlete } from './typescript-fetch-client/models';

export type StravaOAuth = {
	token_type: string;
	expires_at: number;
	expires_in: number;
	refresh_token: string;
	access_token: string;
	athlete: SummaryAthlete;
};

export async function getTokenFromAuthCode(code: string): Promise<StravaOAuth> {
	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_STRAVA_CLIENT_ID,
			client_secret: SECRET_STRAVA_CLIENT_SECRET,
			code: code,
			grant_type: 'authorization_code'
		})
	});
	return await response.json();
}

export type StravaOAuthRefresh = {
	token_type: string;
	expires_at: number;
	expires_in: number;
	refresh_token: string;
	access_token: string;
};

export async function refreshAccessToken(refresh_token: string): Promise<StravaOAuthRefresh> {
	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_STRAVA_CLIENT_ID,
			client_secret: SECRET_STRAVA_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		})
	});
	return await response.json();
}

export async function authenticateStravaIntegration(user_id: string) {
	try {
		const integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
			where: {
				AND: [
					{
						user_id: user_id,
						provider: ThirdPartyIntegrationProvider.STRAVA
					}
				]
			}
		});
		if (integration.expires_at < Date.now()) {
			// needs new refresh token
			const token_obj: StravaOAuthRefresh = await refreshAccessToken(integration.refresh_token);
			await prisma.thirdPartyIntegrationToken.update({
				where: {
					id: integration.id
				},
				data: {
					expires_at: token_obj.expires_at,
					expires_in: token_obj.expires_in,
					access_token: token_obj.access_token,
					refresh_token: token_obj.refresh_token
				}
			});
		}
	} catch (e) {
		error(404);
	}
}

