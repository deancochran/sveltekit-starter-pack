import { authenticateStravaIntegration } from "./auth";
import type { DetailedActivity } from "./typescript-fetch-client/models";
// import type { StravaActicity } from "./types";
// 
export async function getStravaActivities(user_id:string, strava_access_token:string):Promise<Array<DetailedActivity>> {
	await authenticateStravaIntegration(user_id)
	const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
		method: 'GET',
		headers: {
			'Authorization':`Bearer ${strava_access_token}`
		}
	});
	return await res.json()
}