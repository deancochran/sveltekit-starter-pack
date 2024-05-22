import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	const sessions = await prisma.trainingSession.findMany({
		where: {
			user_id: data.user?.id
		},
		include: {

			third_party_training_sessions: true


		}
	});
	if (sessions.length === 0) {
		const t: ToastSettings = {
			message: 'You have no custom training sessions yet',
			background: 'variant-filled-error'
		} as const;
		redirect('/sessions/create', t, event);
	}

	return {
		...data,
		sessions
	};
};
