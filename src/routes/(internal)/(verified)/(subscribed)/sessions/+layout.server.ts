import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	const training_sessions = await prisma.trainingSession.findMany({
		where: {
			user_id: data.user?.id
		}
	});
	// if (sessions.length === 0) {
	// 	const t: ToastSettings = {
	// 		message: 'You have no custom training sessions yet',
	// 		background: 'variant-filled-error'
	// 	} as const;
	// 	redirect('/sessions/create', t, event);
	// }

	return {
		...data,
		training_sessions
	};
};
