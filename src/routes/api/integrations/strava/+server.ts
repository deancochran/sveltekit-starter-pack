import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import { error, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const { locals } = event;
	if (!locals.user) throw new Error('No user found');
	try {
		const integration = await db.query.thirdPartyIntegrationToken.findFirst({
			where: and(
				eq(thirdPartyIntegrationToken.userId, locals.user.id),
				eq(thirdPartyIntegrationToken.provider, 'STRAVA')
			)
		});

		const exists = !!integration;
		return new Response(JSON.stringify({ exists }), { status: 200 });
	} catch (e) {
		error(500);
	}
};
