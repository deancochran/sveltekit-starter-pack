import type { DetailedActivity } from './typescript-fetch-client/models';
//
export async function getStravaActivities(
	user_id: string,
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
