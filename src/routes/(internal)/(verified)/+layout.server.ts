import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	if (!data.session.user.email_verified) redirect(302, '/verify-email');
	return data;
};
