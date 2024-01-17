import { ThirdPartyIntegrationProvider } from '@prisma/client';
import type { StravaSubscriptionWebhookEvent } from '$lib/utils/integrations/strava/types.js';
import { error, json } from '@sveltejs/kit';


export async function GET(event) {
	const {url} = event
	const hub_mode = url.searchParams.get('hub.mode')
	if(hub_mode!=="subscribe") error(400)
	
	const hub_verify_token = url.searchParams.get('hub.verify_token')
	if(hub_verify_token!=="cadence") error(400)
	
	const hub_challenge = url.searchParams.get('hub.challenge')
	return json({ "hub.challenge": hub_challenge }, { status: 200 });
}


export async function POST(event) {
	const {request} = event
	const hook_data:StravaSubscriptionWebhookEvent = await request.json()
	
	switch (hook_data.aspect_type) {
		case "create":
			try{
				await prisma.thirdPartyIntegrationLogs.create({
					data: {
						provider: ThirdPartyIntegrationProvider.STRAVA,
						metadata: hook_data
					}
				});
				return json({ "message": "successful create" }, { status: 200 });
			}catch(e){
				return json({ "message": "failed create" }, { status: 400 });
			}
		case "update":
			try{
				await prisma.thirdPartyIntegrationLogs.update({
					where: {
						
						AND: [
							{
								provider: ThirdPartyIntegrationProvider.STRAVA,
							},
							{
								metadata: {
									path: ['object_id'],
									equals: hook_data.object_id,
								},
							},
						],
					},
					data:{
						metadata: hook_data
					}
				});

				return json({ "message": "successful update" }, { status: 200 });
			}catch(e){
				return json({ "message": "failed update" }, { status: 400 });
			}
		case "delete":
			try{
				await prisma.thirdPartyIntegrationLogs.delete({
					where: {
						AND: [
							{
								provider: ThirdPartyIntegrationProvider.STRAVA,
							},
							{
								metadata: {
									path: ['object_id'],
									equals: hook_data.object_id,
								},
							},
						],
					},
				});
				return json({ "message": "successful delete" }, { status: 200 });
			}catch(e){
				return json({ "message": "failed delete" }, { status: 400 });
			}
		default:
			error(400)
	}
	
}