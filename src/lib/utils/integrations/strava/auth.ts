import { SECRET_STRAVA_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_STRAVA_CLIENT_ID } from '$env/static/public';
import { type thirdPartyIntegrationToken } from '@prisma/client';
import { isWithinExpirationDate } from 'oslo';
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
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}

export async function deauthorizeStravaIntegration(strava_access_token: string): Promise<Response> {
	const response = await fetch(`https://www.strava.com/oauth/deauthorize`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${strava_access_token}`,
			'content-type': 'application/json'
		}
	});
	return response;
}

export async function authenticateStravaIntegration(integration: thirdPartyIntegrationToken) {
	if (!isWithinExpirationDate(integration.expires_at)) {
		const token_obj: StravaOAuthRefresh = await refreshAccessToken(integration.refresh_token);
		integration = await prisma.thirdPartyIntegrationToken.update({
			where: {
				id: integration.id
			},
			data: {
				expires_at: new Date(token_obj.expires_at),
				access_token: token_obj.access_token,
				refresh_token: token_obj.refresh_token
			}
		});
	}

	return integration;
}
