import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { handleVerifyEmailRedirect } from '$lib/utils/redirects/verifyEmailRedirect';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	if (data.user?.email_verified == false) redirect(302, handleVerifyEmailRedirect(event));
	return data;
};
