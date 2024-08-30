import { db } from '$lib/drizzle/client';
import {
	activities,
	thirdPartyIntegrationLogs,
	thirdPartyIntegrationToken,
	user
} from '$lib/drizzle/schema';
import type { StravaSubscriptionWebhookEvent } from '$lib/integrations/strava/types';
import { SportType } from '$lib/integrations/strava/typescript-fetch-client/models';
import { getUserActivityByID } from '$lib/integrations/strava/utils';
import { calcCTss } from '$lib/utils/tss/ctss';
import { calcRIF, calcRTss, calcRunPace } from '$lib/utils/tss/rtss';
import { calcSIF, calcSTss, calcSwimPace } from '$lib/utils/tss/stss';
import { error, json, type RequestEvent } from '@sveltejs/kit';
import { and, eq, sql, type InferSelectModel } from 'drizzle-orm';

const validCTssSportTypes = [
	SportType.EMountainBikeRide,
	SportType.GravelRide,
	SportType.Handcycle,
	SportType.MountainBikeRide,
	SportType.Ride,
	SportType.VirtualRide
];
const validRTssSportTypes = [
	SportType.Run,
	SportType.TrailRun,
	SportType.VirtualRun
];
const validSTssSportTypes = [SportType.Swim];

export async function GET(event: RequestEvent) {
	const { url } = event;
	const hubMode = url.searchParams.get('hub.mode');
	if (hubMode !== 'subscribe') error(400);

	const hubVerifyToken = url.searchParams.get('hub.verify_token');
	if (hubVerifyToken !== 'cadence') error(400);

	const hubChallenge = url.searchParams.get('hub.challenge');
	return json({ 'hub.challenge': hubChallenge }, { status: 200 });
}

export async function POST(event: RequestEvent) {
	const { request } = event;
	try {
		const hookData: StravaSubscriptionWebhookEvent = await request.json();

		const integration = await db.query.thirdPartyIntegrationToken.findFirst({
			where: and(
				eq(thirdPartyIntegrationToken.provider, 'STRAVA'),
				eq(thirdPartyIntegrationToken.integrationId, String(hookData.owner_id))
			)
		});
		if (!integration) throw new Error('No integration Found');
		let newLog;
		let log;
		switch (hookData.aspect_type) {
			case 'create':
				[newLog] = await db
					.insert(thirdPartyIntegrationLogs)
					.values({
						userId: integration.userId,
						tokenId: integration.id,
						provider: 'STRAVA',
						metadata: hookData
					})
					.returning();

				log = await db.query.thirdPartyIntegrationLogs.findFirst({
					where: eq(thirdPartyIntegrationLogs.id, newLog.id),
					with: {
						thirdPartyIntegrationToken: true,
						user: true
					}
				});
				if (!log) throw new Error('No log Found');
				await createActivityFromHook(log);
				return json({ message: 'successful create' }, { status: 200 });

			// TODO UPDATE THIS CASE
			case 'update':
				throw new Error('unimplemented');
				// await updateActivityFromLog(log);
				return json({ message: 'successful update' }, { status: 200 });

			case 'delete':
				await db
					.delete(thirdPartyIntegrationLogs)
					.where(
						and(
							eq(thirdPartyIntegrationLogs.tokenId, integration.id),
							eq(thirdPartyIntegrationLogs.userId, integration.userId),
							eq(thirdPartyIntegrationLogs.provider, 'STRAVA'),
							sql`${thirdPartyIntegrationLogs.metadata}->object_id = ${hookData.object_id}`,
							sql`${thirdPartyIntegrationLogs.metadata}->owner_id = ${hookData.owner_id}`
						)
					);
				return json({ message: 'successful delete' }, { status: 200 });
			default:
				return json({ message: 'Bad aspect_type' }, { status: 400 });
		}
	} catch (e) {
		return json({ message: 'failed delete' }, { status: 400 });
	}
}

async function createActivityFromHook(
	log: {
		thirdPartyIntegrationToken: InferSelectModel<
			typeof thirdPartyIntegrationToken
		>;
		user: InferSelectModel<typeof user>;
	} & InferSelectModel<typeof thirdPartyIntegrationLogs>
) {
	if (log.provider == 'STRAVA') {
		const stravaActivity = log.metadata as StravaSubscriptionWebhookEvent;
		if (stravaActivity.object_type != 'activity') error(400);
		const activity = await getUserActivityByID(
			Number(stravaActivity.object_id),
			log.thirdPartyIntegrationToken.accessToken
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
			const rIF = calcRIF(GAP, log.user.runFtp);
			const tss = calcRTss(activity.moving_time!, GAP, log.user.runFtp, rIF);
			return await db.insert(activities).values({
				type: 'RUN',
				distance: activity.distance ?? 0,
				duration: activity.moving_time ?? 0,
				date: activity.start_date_local,
				userId: log.userId,
				stressScore: tss,
				intensityFactorScore: rIF,
				thirdpartyLogId: log.id,
				externalId: activity.externalId
			});
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
			const cIF = calcRIF(activity.weighted_average_watts!, log.user.runFtp);
			const tss = calcCTss(
				activity.moving_time!,
				activity.weighted_average_watts!,
				log.user.bikeFtp,
				cIF
			);

			return await db.insert(activities).values({
				type: 'BIKE',
				distance: activity.distance ?? 0,
				duration: activity.moving_time ?? 0,
				date: activity.start_date_local,
				userId: log.userId,
				stressScore: tss,
				intensityFactorScore: cIF,
				thirdpartyLogId: log.id,
				externalId: activity.externalId
			});
		} else if (validSTssSportTypes.includes(activity.sport_type)) {
			const requirements = [activity.distance, activity.moving_time];
			if (requirements.some((value) => !value))
				return json(
					{ message: 'activity.distance, activity.moving_time are required' },
					{ status: 400 }
				);
			const GAP = calcSwimPace(activity.distance!, activity.moving_time!);
			const sIF = calcSIF(GAP, log.user.swimFtp);
			const tss = calcSTss(activity.moving_time!, GAP, log.user.swimFtp, sIF);

			return await db.insert(activities).values({
				type: 'SWIM',
				distance: activity.distance ?? 0,
				duration: activity.moving_time ?? 0,
				date: activity.start_date_local,
				userId: log.userId,
				stressScore: tss,
				intensityFactorScore: sIF,
				thirdpartyLogId: log.id,
				externalId: activity.externalId
			});
		} else {
			throw new Error(
				`Function for sport type: ${activity.sport_type} not implemented`
			);
		}
	} else {
		throw new Error('Function not implemented for non strava integration.');
	}
}
