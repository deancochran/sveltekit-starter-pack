import { SECRET_STRAVA_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_STRAVA_CLIENT_ID } from '$env/static/public';
import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import { eq, type InferSelectModel } from 'drizzle-orm';
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

export async function refreshAccessToken(
	refreshToken: string
): Promise<StravaOAuthRefresh> {
	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_STRAVA_CLIENT_ID,
			client_secret: SECRET_STRAVA_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}

export async function deauthorizeStravaIntegration(
	stravaAccessToken: string
): Promise<Response> {
	const response = await fetch(`https://www.strava.com/oauth/deauthorize`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${stravaAccessToken}`,
			'content-type': 'application/json'
		}
	});
	return response;
}

export async function authenticateStravaIntegration(
	integration: InferSelectModel<typeof thirdPartyIntegrationToken>
) {
	if (!isWithinExpirationDate(integration.expiresAt)) {
		const tokenObj: StravaOAuthRefresh = await refreshAccessToken(
			integration.refreshToken
		);
		[integration] = await db
			.update(thirdPartyIntegrationToken)
			.set({
				expiresAt: new Date(tokenObj.expires_at),
				accessToken: tokenObj.access_token,
				refreshToken: tokenObj.refresh_token
			})
			.where(eq(thirdPartyIntegrationToken.id, integration.id))
			.returning();
	}

	return integration;
}
