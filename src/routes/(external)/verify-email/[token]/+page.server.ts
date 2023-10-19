import { validateEmailVerificationToken } from '$lib/utils/token';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event) => {
	const { params, locals, parent } = event;
	await parent();
	const { token } = params;
	let valid
	let t: ToastSettings
	try {
		const userId = await validateEmailVerificationToken(token);
		const user = await auth.getUser(userId);
		await auth.invalidateAllUserSessions(user.userId);
		await auth.updateUserAttributes(user.userId, {
			email_verified: true // `Number(true)` if stored as an integer
		});
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);
		t = {
			message: 'Your Email has Successfully been Verified',
			background: 'variant-filled-success'
		};
		valid=true
	} catch (error) {
		let message;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = String(error);
		}
		t = {
			message: message,
			background: 'variant-filled-warning'
		};
		valid=false
	}
	if(valid) throw redirect('/', t, event)
	else throw redirect('/verify-email', t, event)
	
};
