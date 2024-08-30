import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import { getCurrentUserStravaActivities } from '$lib/integrations/strava/utils';
import { json, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function GET(event: RequestEvent) {
	const { locals } = event;

	try {
		const integration = await db.query.thirdPartyIntegrationToken.findFirst({
			where: and(
				eq(thirdPartyIntegrationToken.userId, locals.user!.id),
				eq(thirdPartyIntegrationToken.provider, 'STRAVA')
			)
		});
		if (!integration) throw new Error('No integration Found');
		return json(
			{ ...(await getCurrentUserStravaActivities(integration.accessToken)) },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{
				message: 'Error retrieving activity... Check your strava integration',
				error: error
			},
			{ status: 400 }
		);
	}
}
