import { db } from '$lib/drizzle/client';
import { trainingSession } from '$lib/drizzle/schema';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();

	if (!Number(params.sessionId)) {
		const t: ToastSettings = {
			message: 'Failed to find session',
			background: 'variant-filled-error'
		} as const;
		redirect(`/sessions`, t, event);
	}
	const _trainingSession = await db.query.trainingSession.findFirst({
		where: eq(trainingSession.id, Number(params.sessionId))
	});
	if (!_trainingSession) {
		const t: ToastSettings = {
			message: 'Failed to find session',
			background: 'variant-filled-error'
		} as const;
		redirect(`/sessions`, t, event);
	}

	return {
		...data,
		trainingSession: _trainingSession
	};
};
