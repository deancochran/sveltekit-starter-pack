import { HOST } from '$env/static/private';
import { db } from '$lib/drizzle/client';
import { session, user } from '$lib/drizzle/schema';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { TimeSpan } from 'oslo';
const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			username: attributes.username,
			emailVerified: attributes.emailVerified,
			createdAt: attributes.createdAt,
			stripeId: attributes.stripeId,
			role: attributes.role,
			bikeFtp: attributes.bikeFtp,
			swimFtp: attributes.swimFtp,
			runFtp: attributes.runFtp,
			maxHr: attributes.maxHr,
			avatarFileId: attributes.avatarFileId,
			bannerFileId: attributes.bannerFileId
		};
	},
	sessionExpiresIn: new TimeSpan(1, 'd'), // no more active/idle
	sessionCookie: {
		name: 'session',
		expires: true, // session cookies have very long lifespan (2 years)
		attributes: {
			domain: HOST,
			sameSite: 'strict',
			path: '.',
			secure: true
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		// DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
// interface DatabaseSessionAttributes {
// 	ip_country?: string;
// }
interface DatabaseUserAttributes {
	email: string;
	username: string;
	emailVerified: boolean;
	createdAt: Date;
	stripeId: string | null;
	role: 'PRO' | 'BASE' | 'TRIAL';
	bikeFtp: number;
	swimFtp: number;
	runFtp: number;
	maxHr: number;
	avatarFileId?: string;
	bannerFileId?: string;
}
