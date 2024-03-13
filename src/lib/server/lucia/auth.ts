import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { user, session, UserRole } from "../drizzle/schema";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { TimeSpan } from "oslo";

const pool = new pg.Pool();
const db = drizzle(pool);

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const lucia = new Lucia(adapter, {
    getSessionAttributes: (attributes) => {
        return {
            country: attributes.country
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
            run_ftp: attributes.run_ftp
        }
    },
    sessionExpiresIn: new TimeSpan(1, "w"), // no more active/idle
    sessionCookie: {
        name: "session",
        expires: false, // session cookies have very long lifespan (2 years)
        attributes: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            domain: process.env.PUBLIC_DOMAIN,
        }
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseSessionAttributes {
    country: string;
}
interface DatabaseUserAttributes {
    email: string;
    username: string;
    email_verified: boolean;
    created_at: Date | undefined;
    stripe_id: string | undefined;
    role: typeof UserRole | undefined;
    bike_ftp: number | undefined;
    swim_ftp: number | undefined;
    run_ftp: number | undefined;
}