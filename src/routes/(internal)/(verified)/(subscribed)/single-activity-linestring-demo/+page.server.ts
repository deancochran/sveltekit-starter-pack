import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import { getStravaActivities } from '$lib/integrations/strava/server';
import type { DetailedActivity } from '$lib/integrations/strava/typescript-fetch-client/models';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch, locals }) => {
	const data = await parent();
	if (!data.user) throw new Error('No user found');
	const integration = await db.query.thirdPartyIntegrationToken.findFirst({
		where: and(
			eq(thirdPartyIntegrationToken.userId, data.user.id),
			eq(thirdPartyIntegrationToken.provider, 'STRAVA')
		)
	});
	if (!integration) throw new Error('No Integration Found');

	await getStravaActivities(integration.userId, integration.accessToken);
	const res = await fetch('/api/user/activities/10560733924');
	const activity: DetailedActivity = await res.json();
	return {
		activity,
		...data
	};
};
