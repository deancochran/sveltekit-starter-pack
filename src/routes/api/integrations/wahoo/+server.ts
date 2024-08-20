import { ThirdPartyIntegrationProvider } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { locals } = event;
	try {
		const integration = await prisma.thirdPartyIntegrationToken.findFirst({
			where: {
				AND: [
					{
						user_id: locals.user?.id,
						provider: ThirdPartyIntegrationProvider.WAHOO
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
