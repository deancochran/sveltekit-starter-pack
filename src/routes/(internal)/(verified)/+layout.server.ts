import { handleVerifyEmailRedirect } from '$lib/utils/redirects/verifyEmailRedirect';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async (event) => {
	const { parent } = event;
	const data = await parent();

	if (data.user?.emailVerified == false)
		redirect(302, handleVerifyEmailRedirect(event));
	return data;
};
