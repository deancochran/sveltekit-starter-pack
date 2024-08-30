import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
	throw new Error('No url');
}

export default defineConfig({
	dialect: 'postgresql',
	out: './src/lib/drizzle/migrations',
	schema: './src/lib/drizzle/schema.ts',
	dbCredentials: {
		url: DATABASE_URL
	},
	introspect: {
		casing: 'camel'
	},
	verbose: true
});
