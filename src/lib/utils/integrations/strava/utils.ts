import { ThirdPartyIntegrationProvider, type thirdPartyIntegrationToken } from '@prisma/client';
import type { DetailedActivity, StreamSet } from './typescript-fetch-client/models';
import { authenticateStravaIntegration, deauthorizeStravaIntegration } from './auth';

type userHasStravaIntegrationResponse = {
	exists: boolean;
};
export async function userHasStravaIntegration(): Promise<userHasStravaIntegrationResponse> {
	const res = await fetch('/api/integrations/strava');
	return await res.json();
}
type userStravaActivitiesResponse = {
	activities: Array<unknown>;
};
export async function userStravaActivities(): Promise<userStravaActivitiesResponse> {
	const res = await fetch('/api/integrations/strava/activities');
	return await res.json();
}

export async function getCurrentUserStravaActivities(
	strava_access_token: string
): Promise<Array<DetailedActivity>> {
	const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${strava_access_token}`
		}
	});
	return await res.json();
}

export async function getUserActivityByID(
	activity_id: number,
	strava_access_token: string
): Promise<DetailedActivity> {
	const res = await fetch(`https://www.strava.com/api/v3/activities/${activity_id}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${strava_access_token}`
		}
	});
	return await res.json();
}

export async function getUserActivityLapsByID(
	activity_id: number,
	strava_access_token: string
): Promise<Array<unknown>> {
	const res = await fetch(`https://www.strava.com/api/v3/activities/${activity_id}/laps`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${strava_access_token}`
		}
	});
	return await res.json();
}
export async function getUserActivityZonesByID(
	activity_id: number,
	strava_access_token: string
): Promise<Array<unknown>> {
	const res = await fetch(`https://www.strava.com/api/v3/activities/${activity_id}/zones`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${strava_access_token}`
		}
	});
	return await res.json();
}
export async function getUserActivitySteamsByID(
	activity_id: number,
	keys: (
		| 'time'
		| 'distance'
		| 'latlng'
		| 'altitude'
		| 'velocity_smooth'
		| 'heartrate'
		| 'cadence'
		| 'watts'
		| 'temp'
		| 'moving'
		| 'grade_smooth'
		| 'grade_adjusted_distance'
	)[],
	strava_access_token: string
): Promise<StreamSet> {
	const res = await fetch(
		`https://www.strava.com/api/v3/activities/${activity_id}/streams/?keys=${keys}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${strava_access_token}`
			}
		}
	);
	return await res.json();
}

export async function getLoggedInAthleteZones(
	strava_access_token: string
): Promise<Array<unknown>> {
	const res = await fetch(`https://www.strava.com/api/v3/athlete/zones`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${strava_access_token}`
		}
	});
	return await res.json();
}

export async function unauthorize(strava_access_token: string): Promise<Array<DetailedActivity>> {
	const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${strava_access_token}`
		}
	});
	return await res.json();
}

export async function disconnect_integration(integration: thirdPartyIntegrationToken) {
	// Step: 1 Use a switch case statement to identify the provider type
	// Step: 2 fetch with the correct endpoint of the provider type
	// Step 3: Return the response
	let res: Response;
	const provider: ThirdPartyIntegrationProvider =
		integration.provider as ThirdPartyIntegrationProvider;
	switch (provider) {
		case ThirdPartyIntegrationProvider.STRAVA: {
			integration = await authenticateStravaIntegration(integration);
			res = await deauthorizeStravaIntegration(integration.access_token);
		}
	}
	if (!res.ok) {
		throw new Error('Error Disconnecting Integration');
	}
	return integration;
}
