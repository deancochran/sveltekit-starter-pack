import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (data.user?.emailVerified == true) redirect(`/`, event);
	return data;
};
