import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { training_plan_schema } from '$lib/schemas';
export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	const trainingPlanSchema = await superValidate(zod(training_plan_schema));
	return { trainingPlanSchema, ...data };
};
