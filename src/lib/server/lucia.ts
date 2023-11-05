import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { prisma as Adapter } from '@lucia-auth/adapter-prisma';
import { prisma } from '$lib/server/prisma';
import { github } from '@lucia-auth/oauth/providers';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

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

export const githubAuth = github(auth, {
	// config
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET,
	scope: ['user:email']
});

export type Auth = typeof auth;
