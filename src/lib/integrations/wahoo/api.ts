import { SECRET_WAHOO_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_WAHOO_CLIENT_ID } from '$env/static/public';
import { db } from '$lib/drizzle/client';
import { thirdPartyIntegrationToken, user } from '$lib/drizzle/schema';
import { addHours } from '$lib/utils/datetime';
import { error } from 'console';
import { eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
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
	private integration: InferSelectModel<typeof thirdPartyIntegrationToken>;

	constructor(
		integration: InferSelectModel<typeof thirdPartyIntegrationToken>
	) {
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
				refresh_token: this.integration.refreshToken
			})
		});
		if (!response.ok) {
			throw new Error(await response.text());
		}
		return await response.json();
	}
	private async authenticateIntegration() {
		if (!isWithinExpirationDate(this.integration.expiresAt)) {
			const tokenObj: WahooTokenObj = await this.refreshToken();
			await db
				.update(thirdPartyIntegrationToken)
				.set({
					expiresAt: addHours(new Date(), 2),
					accessToken: tokenObj.access_token,
					refreshToken: tokenObj.refresh_token
				})
				.where(eq(thirdPartyIntegrationToken.id, this.integration.id));
		}
	}
	private async validatedFetch(url: string, options?: RequestInit) {
		await this.authenticateIntegration();
		const response = await fetch(this.BASE_URL + url, {
			...options,
			headers: {
				...options?.headers,
				Authorization: `Bearer ${this.integration.accessToken}`
			}
		});
		if (!response.ok) {
			console.log(
				'Failed Fetch:',
				response.status,
				response.statusText,
				await response.text()
			);
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

	async createWorkout(
		body: WahooCreateWorkoutRequestBody
	): Promise<WahooCreateWorkoutResponse> {
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
		wahooPlanId: number | string,
		body: WahooV1PlanRequestBody
	): Promise<WahooV1PlanResponse> {
		return await this.validatedFetch(`/v1/plans/${wahooPlanId}`, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({ ...body, external_id: undefined })
		});
	}
	async deletePlan(wahooPlanId: number | string): Promise<WahooV1PlanResponse> {
		return await this.validatedFetch(`/v1/plans/${wahooPlanId}`, {
			method: 'DELETE'
		});
	}
}

/**
 * Functions that do not require an integration access token, or that require a refresh token
 *  - getUser
 *  - createWahooIntegration
 *  - getTokenFromAuthCode
 */

export async function getUser(wahooAccessToken: string): Promise<WahooUser> {
	const response = await fetch('https://api.wahooligan.com/v1/user', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${wahooAccessToken}`,
			'content-type': 'application/json'
		}
	});
	if (!response.ok) {
		throw new Error(await response.text());
	}
	return await response.json();
}

export async function createWahooIntegration(
	_user: InferInsertModel<typeof user> | User,
	WahooTokenObj: WahooTokenObj
): Promise<InferInsertModel<typeof thirdPartyIntegrationToken>> {
	const [integration] = await db.transaction(async (ctx) => {
		const wahooUser = await getUser(WahooTokenObj.access_token);
		return await ctx
			.insert(thirdPartyIntegrationToken)
			.values({
				userId: _user.id,
				integrationId: String(wahooUser.id),
				provider: 'WAHOO',
				expiresAt: addHours(new Date(), 2),
				accessToken: WahooTokenObj.access_token,
				refreshToken: WahooTokenObj.refresh_token,
				updatedAt: new Date()
			})
			.onConflictDoUpdate({
				target: [
					thirdPartyIntegrationToken.userId,
					thirdPartyIntegrationToken.provider
				],
				set: {
					integrationId: String(wahooUser.id),
					expiresAt: addHours(new Date(), 2),
					accessToken: WahooTokenObj.access_token,
					refreshToken: WahooTokenObj.refresh_token,
					updatedAt: new Date()
				}
			})
			.returning();
	});
	return integration;
}

export async function getTokenFromAuthCode(
	code: string
): Promise<WahooTokenObj> {
	console.log('check wahoo getTokenFromAuthCode redirect URL is missing');
	const response = await fetch('https:/api.wahooligan.com/oauth/token', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client_id: PUBLIC_WAHOO_CLIENT_ID,
			client_secret: SECRET_WAHOO_CLIENT_SECRET,
			// redirect_uri: PUBLIC_WAHOO_CLIENT_REDIRECT_URI,
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
