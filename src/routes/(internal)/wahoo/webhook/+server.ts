import { SECRET_WAHOO_WEBHOOK_TOKEN } from '$env/static/private';
import { db } from '$lib/drizzle/client';
import {
	activities,
	thirdPartyIntegrationLogs,
	thirdPartyIntegrationToken,
	user
} from '$lib/drizzle/schema';
import {
	WahooBikingWorkoutTypeIds,
	WahooRunningWorkoutTypeIds,
	WahooSWimmingWorkoutTypeIds,
	type WahooWebhookEvent
} from '$lib/integrations/wahoo/types';
import { calcCTss } from '$lib/utils/tss/ctss';
import { calcRIF, calcRTss, calcRunPace } from '$lib/utils/tss/rtss';
import { calcSIF, calcSTss, calcSwimPace } from '$lib/utils/tss/stss';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from 'console';
import { json } from 'd3';
import { and, eq, type InferSelectModel } from 'drizzle-orm';

// import { calcCTss } from '$lib/utils/tss/ctss';
// import { calcRIF, calcRTss, calcRunPace } from '$lib/utils/tss/rtss';
// import { calcSIF, calcSTss, calcSwimPace } from '$lib/utils/tss/stss';

// import { error, json, type RequestEvent } from '@sveltejs/kit';
// import { and, eq, type InferSelectModel } from 'drizzle-orm';

export async function POST(event: RequestEvent) {
	const { request } = event;
	const hookData: WahooWebhookEvent = await request.json();

	if (hookData.webhook_token !== SECRET_WAHOO_WEBHOOK_TOKEN) {
		error(401);
	}

	const integration = await db.query.thirdPartyIntegrationToken.findFirst({
		where: and(
			eq(thirdPartyIntegrationToken.provider, 'WAHOO'),
			eq(thirdPartyIntegrationToken.integrationId, String(hookData.user.id))
		)
	});
	if (!integration) throw new Error('No integration Found');
	try {
		if (hookData.event_type != 'wahoo_workout_summary')
			json('event_type is not wahoo_workout_summary');

		const [newLog] = await db
			.insert(thirdPartyIntegrationLogs)
			.values({
				userId: integration.userId,
				tokenId: integration.id,
				provider: 'WAHOO',
				metadata: hookData
			})
			.returning();
		const log = await db.query.thirdPartyIntegrationLogs.findFirst({
			where: eq(thirdPartyIntegrationLogs.id, newLog.id),
			with: {
				thirdPartyIntegrationToken: true,
				user: true
			}
		});
		if (!log) throw new Error('No Log Found');
		return await createActivityFromHook(log);
	} catch (e) {
		return json('failed create');
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
	const meta = log.metadata as unknown as WahooWebhookEvent;

	const workout = meta.workout;
	const workoutSummary = meta.workout_summary;

	if (WahooRunningWorkoutTypeIds.includes(workout.workout_type_id)) {
		const requirements = [
			workoutSummary.distance_accum,
			workoutSummary.duration_active_accum
		];
		if (requirements.some((value) => !value))
			return json('Invalid Run Requirements');
		const GAP = calcRunPace(
			workoutSummary.distance_accum!,
			workoutSummary.duration_active_accum!
		);
		const rIF = calcRIF(GAP, log.user.runFtp);
		const tss = calcRTss(
			workoutSummary.duration_active_accum!,
			GAP,
			log.user.runFtp,
			rIF
		);
		return await db.insert(activities).values({
			type: 'RUN',
			distance: workoutSummary.distance_accum ?? 0,
			duration: workoutSummary.duration_active_accum ?? 0,
			date: workout.starts,
			userId: log.userId,
			stressScore: tss,
			intensityFactorScore: rIF,
			thirdpartyLogId: log.id,
			externalId: String(workoutSummary.id)
		});
	} else if (WahooBikingWorkoutTypeIds.includes(workout.workout_type_id)) {
		const requirements = [
			workoutSummary.power_bike_np_last,
			workoutSummary.power_bike_np_last,
			workoutSummary.duration_active_accum
		];
		if (requirements.some((value) => !value))
			return json('Invalid Bike Requirements');
		const cIF = calcRIF(workoutSummary.power_bike_np_last!, log.user.runFtp);
		const tss = calcCTss(
			workoutSummary.duration_active_accum!,
			workoutSummary.power_bike_np_last!,
			log.user.bikeFtp,
			cIF
		);
		return await db.insert(activities).values({
			type: 'BIKE',
			distance: workoutSummary.distance_accum ?? 0,
			duration: workoutSummary.duration_active_accum ?? 0,
			date: workout.starts,
			userId: log.userId,
			stressScore: tss,
			intensityFactorScore: cIF,
			thirdpartyLogId: log.id,
			externalId: String(workoutSummary.id)
		});
	} else if (WahooSWimmingWorkoutTypeIds.includes(workout.workout_type_id)) {
		const requirements = [
			workoutSummary.distance_accum,
			workoutSummary.duration_active_accum
		];
		if (requirements.some((value) => !value))
			return json('Invalid Swim Requirements');
		const GAP = calcSwimPace(
			workoutSummary.distance_accum!,
			workoutSummary.duration_active_accum!
		);
		const sIF = calcSIF(GAP, log.user.swimFtp);
		const tss = calcSTss(
			workoutSummary.duration_active_accum!,
			GAP,
			log.user.swimFtp,
			sIF
		);
		return await db.insert(activities).values({
			type: 'SWIM',
			distance: workoutSummary.distance_accum ?? 0,
			duration: workoutSummary.duration_active_accum ?? 0,
			date: workout.starts,
			userId: log.userId,
			stressScore: tss,
			intensityFactorScore: sIF,
			thirdpartyLogId: log.id,
			externalId: String(workoutSummary.id)
		});
	} else {
		return json('Workout type is not valid');
	}
}
