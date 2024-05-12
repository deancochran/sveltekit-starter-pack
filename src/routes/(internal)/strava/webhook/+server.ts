import {
	ActivityType,
	ThirdPartyIntegrationProvider,
	type thirdPartyIntegrationLogs,
	type thirdPartyIntegrationToken,
	type user
} from '@prisma/client';
import type { StravaSubscriptionWebhookEvent } from '$lib/utils/integrations/strava/types.js';
import { error, json } from '@sveltejs/kit';
import { getUserActivityByID } from '$lib/utils/integrations/strava/utils';
import { SportType } from '$lib/utils/integrations/strava/typescript-fetch-client/models';
import { calcSwimPace, calc_sIF, calc_sTss } from '$lib/utils/tss/stss';
import { calcRunPace, calc_rIF, calc_rTss } from '$lib/utils/tss/rtss';
import { calc_cTss } from '$lib/utils/tss/ctss';

const valid_cTss_sport_types = [
	SportType.EMountainBikeRide,
	SportType.GravelRide,
	SportType.Handcycle,
	SportType.MountainBikeRide,
	SportType.Ride,
	SportType.VirtualRide
];
const valid_rTss_sport_types = [SportType.Run, SportType.TrailRun, SportType.VirtualRun];
const valid_sTss_sport_types = [SportType.Swim];

export async function GET(event) {
	const { url } = event;
	const hub_mode = url.searchParams.get('hub.mode');
	if (hub_mode !== 'subscribe') error(400);

	const hub_verify_token = url.searchParams.get('hub.verify_token');
	if (hub_verify_token !== 'cadence') error(400);

	const hub_challenge = url.searchParams.get('hub.challenge');
	return json({ 'hub.challenge': hub_challenge }, { status: 200 });
}

export async function POST(event) {
	const { request } = event;
	const hook_data: StravaSubscriptionWebhookEvent = await request.json();

	const integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
		where: {
			AND: [
				{
					provider: ThirdPartyIntegrationProvider.STRAVA
				},
				{
					integration_id: String(hook_data.owner_id)
				}
			]
		}
	});
	switch (hook_data.aspect_type) {
		case 'create':
			try {
				const log = await prisma.thirdPartyIntegrationLogs.create({
					data: {
						user_id: integration.user_id,
						token_id: integration.id,
						provider: ThirdPartyIntegrationProvider.STRAVA,
						metadata: hook_data
					},
					include: {
						token: true,
						user: true
					}
				});
				await createActivityFromHook(log);
				return json({ message: 'successful create' }, { status: 200 });
			} catch (e) {
				return json({ message: 'failed create' }, { status: 400 });
			}
		case 'update':
			try {
				await prisma.thirdPartyIntegrationLogs.updateMany({
					data: {
						metadata: hook_data
					},
					where: {
						AND: [
							{
								token_id: integration.id
							},
							{
								user_id: integration.user_id
							},
							{
								provider: ThirdPartyIntegrationProvider.STRAVA
							},
							{
								metadata: {
									path: ['object_id'],
									equals: hook_data.object_id
								}
							},
							{
								metadata: {
									path: ['owner_id'],
									equals: hook_data.owner_id
								}
							}
						]
					}
				});

				return json({ message: 'successful update' }, { status: 200 });
			} catch (e) {
				return json({ message: 'failed update' }, { status: 400 });
			}
		case 'delete':
			try {
				await prisma.thirdPartyIntegrationLogs.deleteMany({
					where: {
						AND: [
							{
								token_id: integration.id
							},
							{
								user_id: integration.user_id
							},
							{
								provider: ThirdPartyIntegrationProvider.STRAVA
							},
							{
								metadata: {
									path: ['object_id'],
									equals: hook_data.object_id
								}
							},
							{
								metadata: {
									path: ['owner_id'],
									equals: hook_data.owner_id
								}
							}
						]
					}
				});
				return json({ message: 'successful delete' }, { status: 200 });
			} catch (e) {
				return json({ message: 'failed delete' }, { status: 400 });
			}
		default:
			error(400);
	}
}

async function createActivityFromHook(
	log: { token: thirdPartyIntegrationToken; user: user } & thirdPartyIntegrationLogs
) {
	if (log.provider == ThirdPartyIntegrationProvider.STRAVA) {
		const strava_activity = log.metadata as StravaSubscriptionWebhookEvent;
		if (strava_activity.object_type != 'activity') error(400);
		const activity = await getUserActivityByID(
			Number(strava_activity.object_id),
			log.token.access_token
		);

		if (!activity.sport_type)
			return json({ message: `Sport Type: ${activity.sport_type} is not valid` }, { status: 400 });
		if (valid_rTss_sport_types.includes(activity.sport_type)) {
			const requirements = [activity.distance, activity.moving_time];
			if (requirements.some((value) => !value))
				return json(
					{ message: 'activity.distance, activity.moving_time are required' },
					{ status: 400 }
				);
			const GAP = calcRunPace(activity.distance!, activity.moving_time!);
			const rIF = calc_rIF(GAP, log.user.run_ftp);
			const tss = calc_rTss(activity.moving_time!, GAP, log.user.run_ftp, rIF);
			return await prisma.activities.create({
				data: {
					type: ActivityType.RUN,
					distance: activity.distance ?? 0,
					duration: activity.moving_time ?? 0,
					date: activity.start_date_local,
					user_id: log.user_id,
					stress_score: tss,
					intensity_factor_score: rIF,
					thirdparty_log_id: log.id
				}
			});
		} else if (valid_cTss_sport_types.includes(activity.sport_type)) {
			const requirements = [activity.weighted_average_watts, activity.moving_time];
			if (requirements.some((value) => !value))
				return json(
					{ message: 'activity.weighted_average_watts, activity.moving_time are required' },
					{ status: 400 }
				);
			const cIF = calc_rIF(activity.weighted_average_watts!, log.user.run_ftp);
			const tss = calc_cTss(
				activity.moving_time!,
				activity.weighted_average_watts!,
				log.user.bike_ftp,
				cIF
			);
			return await prisma.activities.create({
				data: {
					type: ActivityType.BIKE,
					distance: activity.distance ?? 0,
					duration: activity.moving_time ?? 0,
					date: activity.start_date_local,
					user_id: log.user_id,
					stress_score: tss,
					intensity_factor_score: cIF,
					thirdparty_log_id: log.id
				}
			});
		} else if (valid_sTss_sport_types.includes(activity.sport_type)) {
			const requirements = [activity.distance, activity.moving_time];
			if (requirements.some((value) => !value))
				return json(
					{ message: 'activity.distance, activity.moving_time are required' },
					{ status: 400 }
				);
			const GAP = calcSwimPace(activity.distance!, activity.moving_time!);
			const sIF = calc_sIF(GAP, log.user.swim_ftp);
			const tss = calc_sTss(activity.moving_time!, GAP, log.user.swim_ftp, sIF);
			return await prisma.activities.create({
				data: {
					type: ActivityType.SWIM,
					distance: activity.distance ?? 0,
					duration: activity.moving_time ?? 0,
					date: activity.start_date,
					user_id: log.user_id,
					stress_score: tss,
					intensity_factor_score: sIF,
					thirdparty_log_id: log.id
				}
			});
		} else {
			throw new Error(`Function for sport type: ${activity.sport_type} not implemented`);
		}
	} else {
		throw new Error('Function not implemented for non strava integration.');
	}
}
