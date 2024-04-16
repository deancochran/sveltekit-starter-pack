
import { SECRET_WAHOO_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_WAHOO_CLIENT_ID } from "$env/static/public";
import { addHours } from "$lib/utils/datetime";
import type { thirdPartyIntegrationToken } from "@prisma/client";
import { isWithinExpirationDate } from "oslo";

type userHasWahooIntegrationResponse = {
	exists: boolean;
};
export async function userHasWahooIntegration(): Promise<userHasWahooIntegrationResponse> {
	const res = await fetch('/api/integrations/wahoo');
	return await res.json();
}
export async function getTokenFromAuthCode(code: string): Promise<unknown> {
	const response = await fetch('https:/api.wahooligan.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_WAHOO_CLIENT_ID,
			client_secret: SECRET_WAHOO_CLIENT_SECRET,
            redirect_uri: "https://localhost:5173/wahoo/authorize",
			code: code,
			grant_type: 'authorization_code'
		})
	});
	return await response.json();
}
export async function refreshAccessToken(refresh_token: string): Promise<unknown> {
	const response = await fetch('https:/api.wahooligan.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_WAHOO_CLIENT_ID,
			client_secret: SECRET_WAHOO_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		})
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}
export async function authenticateWahooIntegration(integration: thirdPartyIntegrationToken) {
	if (!isWithinExpirationDate(integration.expires_at)) {
		console.log('user integration is not valid');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const token_obj:any = await refreshAccessToken(integration.refresh_token);
		integration = await prisma.thirdPartyIntegrationToken.update({
			where: {
				id: integration.id
			},
			data: {                 
				expires_at: addHours(new Date(), 2),
				access_token: token_obj.access_token,
				refresh_token: token_obj.refresh_token
			}
		});
	}

	return integration;
}

export async function deauthorizeWahoooIntegration(wahoo_access_token: string): Promise<Response> {
	const response = await fetch('https://api.wahooligan.com/v1/permissions', {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${wahoo_access_token}`,
			'content-type': 'application/json'
		}
	});
	return response;
}
