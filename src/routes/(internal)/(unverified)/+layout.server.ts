import { redirect } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();
	if (data.session.user.email_verified) {
		throw redirect(302, '/');
	}
	return data;
};
