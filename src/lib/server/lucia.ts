import { Lucia } from 'lucia';
import { TimeSpan } from 'oslo';
import type { UserRole } from '@prisma/client';
import { adapter } from './prisma';

export const auth = new Lucia(adapter, {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	getSessionAttributes: (attributes) => {
		return {
			// country: attributes.country
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
			max_hr: attributes.max_hr
		};
	},
	sessionExpiresIn: new TimeSpan(1, 'w'), // no more active/idle
	sessionCookie: {
		name: 'session',
		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			// secure: !dev,
			secure: false,
			sameSite: 'lax',
			domain: process.env.PUBLIC_DOMAIN
		}
	}
});

interface DatabaseSessionAttributes {
	// country: string;
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
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
