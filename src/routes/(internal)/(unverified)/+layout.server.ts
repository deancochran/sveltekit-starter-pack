import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (data.user?.email_verified==true) redirect(302, '/');
	return data;
};
