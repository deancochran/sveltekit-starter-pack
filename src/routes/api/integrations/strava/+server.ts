import { ThirdPartyIntegrationProvider } from '@prisma/client';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const { locals } = event;
	try {
		const integration = await prisma.thirdPartyIntegrationToken.findFirst({
			where: {
				AND: [
					{
						user_id: locals.user?.id,
						provider: ThirdPartyIntegrationProvider.STRAVA
					}
				]
			}
		});
		const exists = !!integration;
		return new Response(JSON.stringify({ exists }), { status: 200 });
	} catch (e) {
		error(500);
	}
};
