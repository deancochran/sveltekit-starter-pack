import type { ToastSettings } from '@skeletonlabs/skeleton';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
export const load: LayoutServerLoad = async (event) => {
	const { parent, params } = event;
	const data = await parent();

	if (!Number(params.plan_id)) error(400);
	const plan = await prisma.trainingPlan.findFirst({
		where: {
			id: Number(params.plan_id),
			user_id: data.user?.id
		},
		include: {
			training_sessions: {
				include: {
					third_party_training_sessions: true
				}
			}
		}
	});
	if (!plan) {
		const t: ToastSettings = {
			message: 'Failed to find plan',
			background: 'variant-filled-error'
		} as const;
		redirect('/plans', t, event);
	}

	return {
		...data,
		plan
	};
};
