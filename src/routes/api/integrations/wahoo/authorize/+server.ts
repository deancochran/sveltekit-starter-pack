import { createWahooIntegration, getTokenFromAuthCode } from '$lib/utils/integrations/wahoo/api';
import type { WahooTokenObj } from '$lib/utils/integrations/wahoo/types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event) {
	const { locals, url } = event;
	let t: ToastSettings;
	if (url.searchParams.has('error')) {
		t = {
			message: 'Case 1 Failed to create wahoo integration',
			background: 'variant-filled-error'
		} as const;
		redirect('/settings', t, event);
	}
	// const scope = url.searchParams.get('scope');
	const code = url.searchParams.get('code');
	if (code) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const token_obj: WahooTokenObj = await getTokenFromAuthCode(code);
			// // verify scope
			if (
				token_obj.scope !==
				'workouts_read workouts_write plans_read plans_write power_zones_read offline_data user_read'
			) {
				throw new Error('Invalid Scope');
			}
			await createWahooIntegration(locals.user!, token_obj);

			t = {
				message: 'Successfully created wahoo integration',
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			t = {
				message: 'Case 2 Failed to create wahoo integration',
				background: 'variant-filled-error'
			} as const;
		}
		redirect('/settings', t, event);
	} else {
		t = {
			message: 'Case 3 Failed to create wahoo integration',
			background: 'variant-filled-error'
		} as const;
		redirect('/settings', t, event);
	}
}
