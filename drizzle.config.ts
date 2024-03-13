import type { Config } from "drizzle-kit";
import { resolve } from 'node:path';

export default {
    driver: 'pg',
    out: './src/lib/server/drizzle',
    schema: [resolve(__dirname, './src/lib/server/drizzle/schema.ts')],
    dbCredentials: {
        // host: String(process.env.DB_HOST),
        // port: Number(process.env.DB_PORT),
        // user: process.env.DB_USERNAME,
        // password: process.env.DB_PASSWORD,
        // database: String(process.env.DB_NAME),
        connectionString: String(process.env.DB_URL)
    },
    // Print all statements
    verbose: true,
    // Always ask for confirmation
    strict: true,
} satisfies Config;