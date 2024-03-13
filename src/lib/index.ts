// place files you want to import through the `$lib` alias in this folder.
import 'dotenv/config';
import { client, db } from '$lib/server/drizzle/db'
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';


(async () => {
    await client.connect();

    // This command run all migrations from the migrations folder and apply changes to the database
    await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });

    // ... start your application
})();