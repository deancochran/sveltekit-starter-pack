import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma as Adapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';
import type { UserSchema } from 'lucia-auth';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: Adapter(prisma),
	getUserAttributes: (data: UserSchema) => {
		return {
			username: data.username,
			email: data.email,
			email_verified: data.email_verified,
			created_at: data.created_at,
			stripe_id: data.stripe_id,
			role: data.role
		};
	},
	sessionCookie: {
		expires: false
	}
});

export type Auth = typeof auth;
