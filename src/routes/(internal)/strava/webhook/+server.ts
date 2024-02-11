import { ActivityType, ThirdPartyIntegrationProvider, type activities, type thirdPartyIntegrationLogs, type thirdPartyIntegrationToken, type user } from '@prisma/client';
import type { StravaSubscriptionWebhookEvent } from '$lib/utils/integrations/strava/types.js';
import { error, json } from '@sveltejs/kit';
import { getUserActivityByID } from '$lib/utils/integrations/strava/utils';
import { SportType, type DetailedActivity } from '$lib/utils/integrations/strava/typescript-fetch-client/models';
import { calcSwimPace, calc_sTss } from '$lib/utils/tss/stss';
import { calcRunPace, calc_rTss } from '$lib/utils/tss/rtss';
import { calc_cTss } from '$lib/utils/tss/ctss';

const valid_cTss_sport_types = [SportType.EMountainBikeRide, SportType.GravelRide, SportType.Handcycle, SportType.MountainBikeRide, SportType.Ride, SportType.VirtualRide]
const valid_rTss_sport_types = [SportType.Run, SportType.TrailRun, SportType.VirtualRun]
const valid_sTss_sport_types = [SportType.Swim]

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

	let integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
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
					include:{
						token:true,
						user:true
					}
				});
				await createActivityFromHook(log)
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


async function createActivityFromHook(log: { token: thirdPartyIntegrationToken, user: user} & thirdPartyIntegrationLogs) {
	
	if(log.provider==ThirdPartyIntegrationProvider.STRAVA){
		const strava_activity=(log.metadata as StravaSubscriptionWebhookEvent)
		if(strava_activity.object_type != "activity") error(400)
		const activity = await getUserActivityByID(Number(strava_activity.object_id), log.token.access_token)
		if(!activity.sport_type) error(400)
		if(!activity.distance) error(400)
		if(!activity.moving_time) error(400)
		if(!valid_type(activity.sport_type!)) error(400)
		const type_of_activity = getActivityType(activity.sport_type)
		const tss = await calc_Strava_TSS(log.user,activity)
		// await prisma.activities.create({
		// 	data:{
		// 		type:type_of_activity
		// 		distance:activity.distance,
		// 		duration:activity.moving_time,
		// 		user_id:log.user_id,
		// 		stress_score: tss,
		// 	}
		// })
		throw new Error('Strava Integration not implemented.');
	}else{
		throw new Error('Function not implemented.');
	}
}

function valid_type(sport_type:SportType){
	
	const requirements = [
		valid_sTss_sport_types.includes(sport_type),
		valid_cTss_sport_types.includes(sport_type),
		valid_rTss_sport_types.includes(sport_type),
	]
	// const even = (element) => element % 2 === 0;
	return requirements.some((condition)=>condition===true)
	// 
	// arr.every(fn)
}

function getActivityType(sport_type:SportType):ActivityType{
	if(valid_sTss_sport_types.includes(sport_type)) return ActivityType.SWIMMING
	else if(valid_cTss_sport_types.includes(sport_type)) return ActivityType.CYCLING
	else if(valid_rTss_sport_types.includes(sport_type)) return ActivityType.RUNNING
	else error(400)
}


async function calc_Strava_TSS(user: user,activity:DetailedActivity){
	const type_of_activity = getActivityType(activity.sport_type!)
	switch (type_of_activity) {
		case ActivityType.SWIMMING:
            return calc_sTss(activity.moving_time!, calcSwimPace(activity.distance!, activity.moving_time!), user.swim_ftp)
		case ActivityType.CYCLING:
			return calc_cTss(activity.moving_time!, activity.weighted_average_watts!, user.bike_ftp)
		case ActivityType.RUNNING:
            return calc_rTss(activity.moving_time!, calcRunPace(activity.distance!, activity.moving_time!), user.run_ftp)
		default:
			error(400);
	}

	
}