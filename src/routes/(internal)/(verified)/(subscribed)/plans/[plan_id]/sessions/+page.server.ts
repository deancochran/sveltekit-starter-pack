import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	return { ...data };
};
