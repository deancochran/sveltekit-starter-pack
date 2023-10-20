import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma as Adapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';

export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: Adapter(prisma),
	getUserAttributes: (data) => {
		return {
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
