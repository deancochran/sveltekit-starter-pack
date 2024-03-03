import { lucia, type UserSchema  } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';

import { prisma as Adapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';

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
			role: data.role,
			swim_ftp: data.swim_ftp,
			bike_ftp: data.bike_ftp,
			run_ftp: data.run_ftp,
		};
	},
	sessionCookie: {
		expires: false
	}
});

export type Auth = typeof auth;
