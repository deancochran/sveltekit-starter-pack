import { SECRET_WAHOO_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_WAHOO_CLIENT_ID, PUBLIC_WAHOO_CLIENT_REDIRECT_URI } from '$env/static/public';
import { addHours } from '$lib/utils/datetime';
import { ThirdPartyIntegrationProvider, type thirdPartyIntegrationToken } from '@prisma/client';
import { error } from 'console';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import type {
	WahooCreateWorkoutRequestBody,
	WahooCreateWorkoutResponse,
	WahooTokenObj,
	WahooUser,
	WahooV1PlanRequestBody,
	WahooV1PlanResponse
} from './types';

export class WahooAPI {
	private readonly BASE_URL: string = 'https://api.wahooligan.com';
	private integration: thirdPartyIntegrationToken;

	constructor(integration: thirdPartyIntegrationToken) {
		this.integration = integration;
	}
	private async refreshToken(): Promise<WahooTokenObj> {
		const response = await fetch(this.BASE_URL + '/oauth/token', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				client_id: PUBLIC_WAHOO_CLIENT_ID,
				client_secret: SECRET_WAHOO_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: this.integration.refresh_token
			})
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		return await response.json();
	}
	private async authenticateIntegration() {
		if (!isWithinExpirationDate(this.integration.expires_at)) {
			const token_obj: WahooTokenObj = await this.refreshToken();
			this.integration = await prisma.thirdPartyIntegrationToken.update({
				where: {
					id: this.integration.id
				},
				data: {
					expires_at: addHours(new Date(), 2),
					access_token: token_obj.access_token,
					refresh_token: token_obj.refresh_token
				}
			});
		}
	}
	private async validatedFetch(url: string, options?: RequestInit) {
		await this.authenticateIntegration();
		const response = await fetch(this.BASE_URL + url, {
			...options,
			headers: {
				...options?.headers,
				Authorization: `Bearer ${this.integration.access_token}`
			}
		});
		if (!response.ok) {
			console.log('Failed Fetch:', response.status, response.statusText, await response.text());
			error(await response.text());
		}
		return await response.json();
	}
	async unauthorizeIntegration(): Promise<void> {
		await this.validatedFetch('/v1/permissions', {
			method: 'DELETE'
		});
	}
	async getCurrentUser(): Promise<WahooUser> {
		return await this.validatedFetch('/v1/user');
	}

	async createWorkout(body: WahooCreateWorkoutRequestBody): Promise<WahooCreateWorkoutResponse> {
		return await this.validatedFetch('/v1/workouts', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(body)
		});
	}
	async createPlan(body: WahooV1PlanRequestBody): Promise<WahooV1PlanResponse> {
		return await this.validatedFetch('/v1/plans', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(body)
		});
	}
	async updatePlan(
		wahoo_plan_id: number | string,
		body: WahooV1PlanRequestBody
	): Promise<WahooV1PlanResponse> {
		return await this.validatedFetch(`/v1/plans/${wahoo_plan_id}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ ...body, external_id: undefined })
		});
	}
	async deletePlan(wahoo_plan_id: number | string): Promise<WahooV1PlanResponse> {
		return await this.validatedFetch(`/v1/plans/${wahoo_plan_id}`, { method: 'DELETE' });
	}
}

/**
 * Functions that do not require an integration access token, or that require a refresh token
 *  - getUser
 *  - createWahooIntegration
 *  - getTokenFromAuthCode
 */

export async function getUser(wahoo_access_token: string): Promise<WahooUser> {
	const response = await fetch('https://api.wahooligan.com/v1/user', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${wahoo_access_token}`,
			'content-type': 'application/json'
		}
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}

export async function createWahooIntegration(
	user: User,
	WahooTokenObj: WahooTokenObj
): Promise<thirdPartyIntegrationToken> {
	const new_integration = await prisma.$transaction(async (db) => {
		const wahoo_user = await getUser(WahooTokenObj.access_token);
		return await db.thirdPartyIntegrationToken.upsert({
			where: {
				integration_id: String(wahoo_user.id)
			},
			update: {
				integration_id: String(wahoo_user.id),
				expires_at: addHours(new Date(), 2),
				access_token: WahooTokenObj.access_token,
				refresh_token: WahooTokenObj.refresh_token
			},
			create: {
				user_id: user.id,
				integration_id: String(wahoo_user.id),
				provider: ThirdPartyIntegrationProvider.WAHOO,
				expires_at: addHours(new Date(), 2),
				access_token: WahooTokenObj.access_token,
				refresh_token: WahooTokenObj.refresh_token
			}
		});
	});
	return new_integration;
}

export async function getTokenFromAuthCode(code: string): Promise<WahooTokenObj> {
	const response = await fetch('https:/api.wahooligan.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_WAHOO_CLIENT_ID,
			client_secret: SECRET_WAHOO_CLIENT_SECRET,
			redirect_uri: PUBLIC_WAHOO_CLIENT_REDIRECT_URI,
			code: code,
			grant_type: 'authorization_code'
		})
	});
	return await response.json();
}

export async function userHasWahooIntegration(): Promise<{ exists: boolean }> {
	const res = await fetch('/api/integrations/wahoo');
	return await res.json();
}
