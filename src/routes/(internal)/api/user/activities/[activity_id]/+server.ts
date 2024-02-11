import { getUserActivityByID } from '$lib/utils/integrations/strava/utils';
import { ThirdPartyIntegrationProvider } from '@prisma/client';
import { json } from '@sveltejs/kit';
import type { Session } from 'lucia';



export async function GET(event) {
	const { params, locals } = event;
	const { activity_id } = params;

    try {
        const session: Session = await locals.auth.validate();
        const integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
            where: {
                AND: [
                    {
                        user_id: session.user.id,
                        provider: ThirdPartyIntegrationProvider.STRAVA
                    }
                ]
            }
        });

        return json({ ...(await getUserActivityByID(Number(activity_id), integration.access_token)) }, { status: 200 });
	} catch (error) {
		return json({ "message": "Error retrieving activity... Check your strava integration", "error":error }, { status: 400 });
	}
}

