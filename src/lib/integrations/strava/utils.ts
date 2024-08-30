import type { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { WahooAPI } from '../wahoo/api';
import {
	authenticateStravaIntegration,
	deauthorizeStravaIntegration
} from './auth';
import type {
	DetailedActivity,
	StreamSet
} from './typescript-fetch-client/models';

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
	stravaAccessToken: string
): Promise<Array<DetailedActivity>> {
	const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${stravaAccessToken}`
		}
	});
	return await res.json();
}

export async function getUserActivityByID(
	activityId: number,
	stravaAccessToken: string
): Promise<DetailedActivity> {
	const res = await fetch(
		`https://www.strava.com/api/v3/activities/${activityId}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${stravaAccessToken}`
			}
		}
	);
	return await res.json();
}

export async function getUserActivityLapsByID(
	activityId: number,
	stravaAccessToken: string
): Promise<Array<unknown>> {
	const res = await fetch(
		`https://www.strava.com/api/v3/activities/${activityId}/laps`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${stravaAccessToken}`
			}
		}
	);
	return await res.json();
}
export async function getUserActivityZonesByID(
	activityId: number,
	stravaAccessToken: string
): Promise<Array<unknown>> {
	const res = await fetch(
		`https://www.strava.com/api/v3/activities/${activityId}/zones`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${stravaAccessToken}`
			}
		}
	);
	return await res.json();
}
export async function getUserActivitySteamsByID(
	activityId: number,
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
	stravaAccessToken: string
): Promise<StreamSet> {
	const res = await fetch(
		`https://www.strava.com/api/v3/activities/${activityId}/streams/?keys=${keys}`,
		{
			method: 'GET',
			headers: {
				Authorization: `Bearer ${stravaAccessToken}`
			}
		}
	);
	return await res.json();
}

export async function getLoggedInAthleteZones(
	stravaAccessToken: string
): Promise<Array<unknown>> {
	const res = await fetch(`https://www.strava.com/api/v3/athlete/zones`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${stravaAccessToken}`
		}
	});
	return await res.json();
}

export async function unauthorize(
	stravaAccessToken: string
): Promise<Array<DetailedActivity>> {
	const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${stravaAccessToken}`
		}
	});
	return await res.json();
}

export async function disconnectIntegration(
	integration: InferSelectModel<typeof thirdPartyIntegrationToken>
) {
	// Step: 1 Use a switch case statement to identify the provider type
	// Step: 2 fetch with the correct endpoint of the provider type
	// Step 3: Return the response
	const provider: 'STRAVA' | 'WAHOO' = integration.provider as
		| 'STRAVA'
		| 'WAHOO';
	switch (provider) {
		case 'STRAVA': {
			integration = await authenticateStravaIntegration(integration);
			await deauthorizeStravaIntegration(integration.accessToken);
			break;
		}
		case 'WAHOO': {
			const wahooUser = new WahooAPI(integration);
			await wahooUser.unauthorizeIntegration();
			break;
		}
		default: {
			break;
		}
	}

	return integration;
}
