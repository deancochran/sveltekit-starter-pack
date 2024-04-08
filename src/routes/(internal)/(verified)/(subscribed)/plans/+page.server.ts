import { handleSignInRedirect } from '$lib/utils/redirects/loginRedirect';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	await parent();
	const data = await parent();
	// get all activities in the past week
	if (!data.user) redirect(302, handleSignInRedirect(event));
	const plans = await prisma.trainingPlan.findMany({
		where: {
			user_id: data.user.id
		}
	});
	return {
		plans,
		...data
	};
};
