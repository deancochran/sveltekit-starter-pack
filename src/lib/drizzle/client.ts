import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as relations from './relations';
import * as models from './schema';
const client = new pg.Client({
	connectionString: DATABASE_URL
});
// import { drizzle } from 'drizzle-orm/node-postgres';
// import pg from 'pg';
// const client = new pg.Pool({
// 	connectionString: DATABASE_URL
// });

await client.connect();
export const db = drizzle(client, { schema: { ...models, ...relations } });
