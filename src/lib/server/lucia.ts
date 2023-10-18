// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma as Adapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: Adapter(prisma),
	// previously `transformDatabaseUser`
	getUserAttributes: (data) => {
		return {
			// IMPORTANT!!!!
			// `userId` included by default!!
			email: data.email,
			username: data.username,
			email_verified: data.email_verified
		};
	},
	sessionCookie: {
		expires: false
	}
});

export type Auth = typeof auth;
