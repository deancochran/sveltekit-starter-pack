import {
	readZwiftArchiveWorkouts,
	type Zwift_Archive_Workout
} from '$lib/assets/workouts/zwift_archives';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();
	const workouts = (await readZwiftArchiveWorkouts()) as unknown as Array<Zwift_Archive_Workout>;

	return {
		workouts: workouts as unknown as Array<Zwift_Archive_Workout>,
		...data
	};
};
