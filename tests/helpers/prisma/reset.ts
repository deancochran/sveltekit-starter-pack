// src/tests/helpers/setup.ts
import { beforeEach } from 'vitest'

async function reset() {
	const tablenames = await prisma.$queryRaw<
		Array<{ tablename: string }>
	>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

	for (const { tablename } of tablenames) {
		if (tablename !== '_prisma_migrations') {
			try {
				await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
			} catch (error) {
				console.log({ error });
			}
		}
	}
}

beforeEach(async () => {
  await reset()
})