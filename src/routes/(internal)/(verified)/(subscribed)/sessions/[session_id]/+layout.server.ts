import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();
	const training_session = await prisma.trainingSession.findFirst({
		where: {
			id: Number(params.session_id),
			training_plan_id: data.plan.id
		},
		include: {
			third_party_training_sessions: true
		}
	});
	if (!training_session) {
		const t: ToastSettings = {
			message: 'Failed to find session',
			background: 'variant-filled-error'
		} as const;
		redirect(`/plans/${data.plan.id}/sessions`, t, event);
	}

	return {
		...data,
		training_session
	};
};
