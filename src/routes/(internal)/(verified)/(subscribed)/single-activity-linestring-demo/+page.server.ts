import { getStravaActivities } from '$lib/utils/integrations/strava/server';
import type { DetailedActivity } from '$lib/utils/integrations/strava/typescript-fetch-client/models';
import { ThirdPartyIntegrationProvider } from '@prisma/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch, locals }) => {
	const data = await parent();
	const integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
		where: {
			AND: [
				{
					user_id: locals.user?.id,
					provider: ThirdPartyIntegrationProvider.STRAVA
				}
			]
		}
	});
	await getStravaActivities(integration.user_id, integration.access_token);
	const res = await fetch('/api/user/activities/10560733924');
	const activity: DetailedActivity = await res.json();
	return {
		activity,
		...data
	};
};
