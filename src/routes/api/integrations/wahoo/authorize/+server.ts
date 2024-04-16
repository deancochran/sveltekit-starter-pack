import { addHours } from '$lib/utils/datetime.js';
import { getTokenFromAuthCode } from '$lib/utils/integrations/wahoo/auth';
import { ThirdPartyIntegrationProvider } from '@prisma/client';
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
	const scope = url.searchParams.get('scope');
	const code = url.searchParams.get('code');
	if (code && scope) {
		// verify scope
		if (scope !== 'user_read,workouts_read,workouts_write') {
			t = {
				message: 'Case 2 Failed to create wahoo wahoo integration',
				background: 'variant-filled-error'
			} as const;
			redirect('/settings', t, event);
		}
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const token_obj: any = await getTokenFromAuthCode(code);
			console.log('\n\n\n', token_obj, '\n\n\n');
			await prisma.thirdPartyIntegrationToken.upsert({
				where: {
					integration_id: String(token_obj.athlete.id)
				},
				update: {
					integration_id: String(token_obj.athlete.id),
					expires_at: addHours(new Date(),2),
					access_token: token_obj.access_token,
					refresh_token: token_obj.refresh_token
				},
				create: {
					user_id: locals.user!.id,
					integration_id: String(token_obj.athlete.id),
					provider: ThirdPartyIntegrationProvider.WAHOO,
					expires_at: addHours(new Date(),2),
					access_token: token_obj.access_token,
					refresh_token: token_obj.refresh_token
				}
			});

			t = {
				message: 'Successfully created wahoo integration',
				background: 'variant-filled-success'
			} as const;
		} catch (e) {
			t = {
				message: 'Case 3 Failed to create wahoo integration',
				background: 'variant-filled-error'
			} as const;
		}
		redirect('/settings', t, event);
	} else {
		t = {
			message: 'Case 4 Failed to create wahoo integration',
			background: 'variant-filled-error'
		} as const;
		redirect('/settings', t, event);
	}
}
