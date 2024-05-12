import { SECRET_WAHOO_WEBHOOK_TOKEN } from '$env/static/private';
import {
	WahooBikingWorkoutTypeIds,
	WahooRunningWorkoutTypeIds,
	WahooSWimmingWorkoutTypeIds,
	type WahooWebhookEvent
} from '$lib/utils/integrations/wahoo/types';
import { calc_cTss } from '$lib/utils/tss/ctss';
import { calcRunPace, calc_rIF, calc_rTss } from '$lib/utils/tss/rtss';
import { calcSwimPace, calc_sIF, calc_sTss } from '$lib/utils/tss/stss';

import {
	ActivityType,
	ThirdPartyIntegrationProvider,
	type thirdPartyIntegrationLogs,
	type thirdPartyIntegrationToken,
	type user
} from '@prisma/client';
import { error, json } from '@sveltejs/kit';

export async function POST(event) {
	const { request } = event;
	const hook_data: WahooWebhookEvent = await request.json();

	if (hook_data.webhook_token !== SECRET_WAHOO_WEBHOOK_TOKEN) {
		error(401);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const integration = await prisma.thirdPartyIntegrationToken.findFirstOrThrow({
		where: {
			AND: [
				{
					provider: ThirdPartyIntegrationProvider.WAHOO
				},
				{
					integration_id: String(hook_data.user.id)
				}
			]
		}
	});
	try {
		if (hook_data.event_type != 'wahoo_workout_summary')
			json({ message: 'event_type is not wahoo_workout_summary' }, { status: 400 });
		const log = await prisma.thirdPartyIntegrationLogs.create({
			data: {
				user_id: String(hook_data.user.id),
				token_id: integration.id,
				provider: ThirdPartyIntegrationProvider.WAHOO,
				metadata: hook_data
			},
			include: {
				token: true,
				user: true
			}
		});
		return await createActivityFromHook(log);
	} catch (e) {
		return json({ message: 'failed create' }, { status: 400 });
	}
}

async function createActivityFromHook(
	log: { token: thirdPartyIntegrationToken; user: user } & thirdPartyIntegrationLogs
) {
	const meta = log.metadata as unknown as WahooWebhookEvent;

	const workout = meta.workout;
	const workout_summary = meta.workout_summary;

	if (WahooRunningWorkoutTypeIds.includes(workout.workout_type_id)) {
		const requirements = [workout_summary.distance_accum, workout_summary.duration_active_accum];
		if (requirements.some((value) => !value))
			return json({ message: 'Invalid Run Requirements' }, { status: 400 });
		const GAP = calcRunPace(
			workout_summary.distance_accum!,
			workout_summary.duration_active_accum!
		);
		const rIF = calc_rIF(GAP, log.user.run_ftp);
		const tss = calc_rTss(workout_summary.duration_active_accum!, GAP, log.user.run_ftp, rIF);
		await prisma.activities.create({
			data: {
				type: ActivityType.RUN,
				distance: workout_summary.distance_accum ?? 0,
				duration: workout_summary.duration_active_accum ?? 0,
				date: workout.starts,
				user_id: log.user_id,
				stress_score: tss,
				intensity_factor_score: rIF,
				thirdparty_log_id: log.id
			}
		});
	} else if (WahooBikingWorkoutTypeIds.includes(workout.workout_type_id)) {
		const requirements = [
			workout_summary.power_bike_np_last,
			workout_summary.power_bike_np_last,
			workout_summary.duration_active_accum
		];
		if (requirements.some((value) => !value))
			return json({ message: 'Invalid Bike Requirements' }, { status: 400 });
		const cIF = calc_rIF(workout_summary.power_bike_np_last!, log.user.run_ftp);
		const tss = calc_cTss(
			workout_summary.duration_active_accum!,
			workout_summary.power_bike_np_last!,
			log.user.bike_ftp,
			cIF
		);
		await prisma.activities.create({
			data: {
				type: ActivityType.BIKE,
				distance: workout_summary.distance_accum ?? 0,
				duration: workout_summary.duration_active_accum ?? 0,
				date: workout.starts,
				user_id: log.user_id,
				stress_score: tss,
				intensity_factor_score: cIF,
				thirdparty_log_id: log.id
			}
		});
	} else if (WahooSWimmingWorkoutTypeIds.includes(workout.workout_type_id)) {
		const requirements = [workout_summary.distance_accum, workout_summary.duration_active_accum];
		if (requirements.some((value) => !value))
			return json({ message: 'Invalid Swim Requirements' }, { status: 400 });
		const GAP = calcSwimPace(
			workout_summary.distance_accum!,
			workout_summary.duration_active_accum!
		);
		const sIF = calc_sIF(GAP, log.user.swim_ftp);
		const tss = calc_sTss(workout_summary.duration_active_accum!, GAP, log.user.swim_ftp, sIF);
		await prisma.activities.create({
			data: {
				type: ActivityType.SWIM,
				distance: workout_summary.distance_accum ?? 0,
				duration: workout_summary.duration_active_accum ?? 0,
				date: workout.starts,
				user_id: log.user_id,
				stress_score: tss,
				intensity_factor_score: sIF,
				thirdparty_log_id: log.id
			}
		});
	} else {
		return json({ message: 'Workout type is not valid' }, { status: 400 });
	}

	return json({ message: 'successful create' }, { status: 200 });
}
