import type { ToastSettings } from '@skeletonlabs/skeleton';
import { type RequestEvent } from '@sveltejs/kit';
import type { Session, User } from 'lucia';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { lucia } from './lucia';

export type AuthAction = (
	event: RequestEvent,
	auth: { user: User; session: Session }
) => Promise<any> | any;

export function authAction(
	action: AuthAction
): (event: RequestEvent) => Promise<any> {
	return async (event: RequestEvent) => {
		const auth = await lucia.validateSession(
			event.cookies.get(lucia.sessionCookieName) ?? ''
		);
		if (auth.user && auth.session) {
			return action(event, auth);
		} else {
			const t: ToastSettings = {
				message: 'Unauthorized Access',
				background: 'variant-filled-warning'
			} as const;
			redirect('/sign-in', t, event);
		}
	};
}

export async function handleAction<T>(
	actionLogic: (event: RequestEvent) => Promise<T>
) {
	return async (event: RequestEvent) => {
		try {
			// Execute the custom logic
			return await actionLogic(event);
		} catch (e) {
			if (e instanceof Error) {
				const t: ToastSettings = {
					message: 'Error Occured',
					background: 'variant-filled-warning'
				} as const;
				setFlash(t, event);
				throw new Error('Form Submission Error', { cause: e.cause });
			} else {
				throw new Error('Unknown Error', { cause: e });
			}
		}
	};
}
