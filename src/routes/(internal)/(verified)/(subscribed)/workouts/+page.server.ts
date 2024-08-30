import {
	readZwiftArchiveWorkouts,
	type ZwiftArchiveWorkout
} from '$lib/assets/workouts/zwift_archives';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	const workouts =
		(await readZwiftArchiveWorkouts()) as unknown as Array<ZwiftArchiveWorkout>;

	return {
		workouts: workouts as unknown as Array<ZwiftArchiveWorkout>,
		...data
	};
};
