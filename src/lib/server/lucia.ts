import { Lucia } from 'lucia';
import { TimeSpan } from 'oslo';
import type { UserRole } from '@prisma/client';
import { adapter } from './prisma';

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (attributes) => {
		return {
			ip_country: attributes.ip_country
		};
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			username: attributes.username,
			email_verified: attributes.email_verified,
			created_at: attributes.created_at,
			stripe_id: attributes.stripe_id,
			role: attributes.role,
			bike_ftp: attributes.bike_ftp,
			swim_ftp: attributes.swim_ftp,
			run_ftp: attributes.run_ftp,
			max_hr: attributes.max_hr,
			avatar_file_id: attributes.avatar_file_id,
			banner_file_id: attributes.banner_file_id
		};
	},
	sessionExpiresIn: new TimeSpan(1, 'd'), // no more active/idle
	sessionCookie: {
		name: 'session',
		expires: true, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: process.env.NODE_ENV === 'prod',
			sameSite: 'strict',
			domain: process.env.PUBLIC_DOMAIN
		}
	}
});

interface DatabaseSessionAttributes {
	ip_country?: string;
}
interface DatabaseUserAttributes {
	email: string;
	username: string;
	email_verified: boolean;
	created_at: Date;
	stripe_id: string | null;
	role: typeof UserRole;
	bike_ftp: number;
	swim_ftp: number;
	run_ftp: number;
	max_hr: number;
	avatar_file_id?: string;
	banner_file_id?: string;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
