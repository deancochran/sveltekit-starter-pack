import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken } from '$lib/drizzle/schema';
import {
	SportType,
	type DetailedActivity
} from '$lib/integrations/strava/typescript-fetch-client/models';
import { getUserActivityByID } from '$lib/integrations/strava/utils';
import { calcCTss } from '$lib/utils/tss/ctss';
import {
	calcRIF,
	calcRTss,
	calcRunPace,
	validCTssSportTypes,
	validRTssSportTypes
} from '$lib/utils/tss/rtss';
import {
	calcSIF,
	calcSTss,
	calcSwimPace,
	validSTssSportTypes
} from '$lib/utils/tss/stss';
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
		if (!integration) throw new Error('No integration found');

		const activity: DetailedActivity = await getUserActivityByID(
			Number(activity_id),
			integration.accessToken
		);
		if (!activity.sport_type)
			return json(
				{ message: `Sport Type: ${activity.sport_type} is not valid` },
				{ status: 400 }
			);
		if (validRTssSportTypes.includes(activity.sport_type)) {
			const requirements = [activity.distance, activity.moving_time];
			if (requirements.some((value) => !value))
				return json(
					{ message: 'activity.distance, activity.moving_time are required' },
					{ status: 400 }
				);
			const GAP = calcRunPace(activity.distance!, activity.moving_time!);
			const rIF = calcRIF(GAP, integration.user.runFtp);
			const tss = calcRTss(
				activity.moving_time!,
				GAP,
				integration.user.runFtp,
				rIF
			);

			return json({ tss }, { status: 200 });
		} else if (validCTssSportTypes.includes(activity.sport_type)) {
			const requirements = [
				activity.weighted_average_watts,
				activity.moving_time
			];
			if (requirements.some((value) => !value))
				return json(
					{
						message:
							'activity.weighted_average_watts, activity.moving_time are required'
					},
					{ status: 400 }
				);
			const cIF = calcRIF(
				activity.weighted_average_watts!,
				integration.user.runFtp
			);
			const tss = calcCTss(
				activity.moving_time!,
				activity.weighted_average_watts!,
				integration.user.bikeFtp,
				cIF
			);
			return json({ tss }, { status: 200 });
		} else if (validSTssSportTypes.includes(activity.sport_type)) {
			const requirements = [activity.distance, activity.moving_time];
			if (requirements.some((value) => !value))
				return json(
					{ message: 'activity.distance, activity.moving_time are required' },
					{ status: 400 }
				);
			const GAP = calcSwimPace(activity.distance!, activity.moving_time!);
			const sIF = calcSIF(GAP, integration.user.swimFtp);
			const tss = calcSTss(
				activity.moving_time!,
				GAP,
				integration.user.swimFtp,
				sIF
			);
			return json({ tss }, { status: 200 });
		} else {
			return json(
				{
					message: `Sport Type ${activity.sport_type} is unimplemented`,
					'valid types': [SportType.Run]
				},
				{ status: 400 }
			);
		}
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
