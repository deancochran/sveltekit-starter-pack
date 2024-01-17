import { ThirdPartyIntegrationProvider } from "@prisma/client";
import type { PageServerLoad } from "./$types";
import { getStravaActivities } from "$lib/utils/integrations/strava/server";

export const load: PageServerLoad = async ({ parent }) => {
	await parent();
	const data = await parent();
    const integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
        where: {
            AND: [
                {
                    user_id: data.session.user.userId,
                    provider: ThirdPartyIntegrationProvider.STRAVA
                }
            ]
        }
    });
    const activities = await getStravaActivities(integration.user_id, integration.access_token)
	return {
        activities,
		...data
    }
}