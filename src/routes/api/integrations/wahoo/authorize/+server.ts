import {
	createWahooIntegration,
	getTokenFromAuthCode
} from '$lib/integrations/wahoo/api';
import type { WahooTokenObj } from '$lib/integrations/wahoo/types';
import type { ToastSettings } from '@skeletonlabs/skeleton';
import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export async function GET(event: RequestEvent) {
	console.log('hit');
	const { locals, url } = event;
	let t: ToastSettings;
	if (url.searchParams.has('error')) {
		t = {
			message: 'Case 1 Failed to create wahoo integration',
			background: 'variant-filled-error'
		} as const;
		redirect('/settings', t, event);
	}
	const code = url.searchParams.get('code');
	if (code) {
		try {
			const tokenObj: WahooTokenObj = await getTokenFromAuthCode(code);
			if (
				tokenObj.scope !==
				'workouts_read workouts_write plans_read plans_write power_zones_read offline_data user_read'
			) {
				throw new Error('Invalid Scope');
			}
			await createWahooIntegration(locals.user!, tokenObj);

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
