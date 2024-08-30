import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import { getUserActivityByID } from '$lib/integrations/strava/utils';
import { json, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function GET(event: RequestEvent) {
	const { params, locals } = event;
	const { activity_id } = params;

	try {
		const integration = await db.query.thirdPartyIntegrationToken.findFirst({
			where: and(
				eq(thirdPartyIntegrationToken.userId, locals.user!.id),
				eq(thirdPartyIntegrationToken.provider, 'STRAVA')
			),
			with: {
				user: true
			}
		});
		if (!integration) throw new Error('No Integration Found');

		return json(
			{
				...(await getUserActivityByID(
					Number(activity_id),
					integration.accessToken
				))
			},
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
