import { SportType, type DetailedActivity, type StreamSet, type GradeAdjustedDistanceStream } from '$lib/utils/integrations/strava/typescript-fetch-client/models';
import { getUserActivityByID, getUserActivitySteamsByID } from '$lib/utils/integrations/strava/utils';
import { calc_cTss } from '$lib/utils/tss/ctss';
import { MY_cFTP, MY_rFTP, MY_sFTP, calcRunPace, calc_rTss, valid_cTss_sport_types, valid_rTss_sport_types } from '$lib/utils/tss/rtss';
import { calcSwimPace, calc_sTss, valid_sTss_sport_types } from '$lib/utils/tss/stss';
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

        let activity:DetailedActivity=await getUserActivityByID(Number(activity_id), integration.access_token)
        if(!activity.sport_type )return json({ "message": `Sport Type: ${activity.sport_type} is not valid`}, { status: 400 });
        if(valid_rTss_sport_types.includes(activity.sport_type)) {
            const requirements = [activity.distance, activity.moving_time]
            if(requirements.some(value => !value)) return json({ "message": "activity.distance, activity.moving_time are required"}, { status: 400 });
            // use imperial to calculate rTss
            const GAP = calcRunPace(activity.distance!, activity.moving_time!, true)  
            const rTss = calc_rTss(activity.moving_time!, GAP, MY_rFTP)
            
            return json({ type:activity.sport_type, tss:rTss, GAP}, { status: 200 });
        }else if(valid_cTss_sport_types.includes(activity.sport_type)) {
            const requirements = [activity.weighted_average_watts, activity.moving_time]
            if(requirements.some(value => !value)) return json({ "message": "activity.weighted_average_watts, activity.moving_time are required"}, { status: 400 });
            const Tss = calc_cTss(activity.moving_time!, activity.weighted_average_watts!, MY_cFTP)
            return json({Tss}, { status: 200 });
        }else if(valid_sTss_sport_types.includes(activity.sport_type)) {
            const requirements = [activity.distance, activity.moving_time]
            if(requirements.some(value => !value)) return json({ "message": "activity.distance, activity.moving_time are required"}, { status: 400 });
            const GAP = calcSwimPace(activity.distance!, activity.moving_time!, true)  
            const Tss = calc_sTss(activity.moving_time!, GAP, MY_sFTP)
            return json({Tss}, { status: 200 });
        }else{
            return json({ "message": `Sport Type ${activity.sport_type} is unimplemented`, 'valid types':[SportType.Run]}, { status: 400 });
        }
        
        
	} catch (error) {
		return json({ "message": "Error retrieving activity... Check your strava integration", "error":error }, { status: 400 });
	}


}