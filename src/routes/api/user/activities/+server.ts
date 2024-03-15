import { getCurrentUserStravaActivities } from '$lib/utils/integrations/strava/utils';
import { ThirdPartyIntegrationProvider } from '@prisma/client';
import { json } from '@sveltejs/kit';

export async function GET(event) {
	const { locals } = event;

	try {
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

		return json(
			{ ...(await getCurrentUserStravaActivities(integration.access_token)) },
			{ status: 200 }
		);
	} catch (error) {
		return json(
			{ message: 'Error retrieving activity... Check your strava integration', error: error },
			{ status: 400 }
		);
	}
}
