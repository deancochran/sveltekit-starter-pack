import type { DetailedActivity } from './typescript-fetch-client/models';
//
export async function getStravaActivities(
	userId: string,
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
