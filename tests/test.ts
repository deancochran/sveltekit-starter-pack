// test/sample.test.ts
import { expect, test, vi } from 'vitest';
import { UnitType, UserRole } from '@prisma/client';

import prisma from '$lib/server/__mocks__/prisma';
import { createUser, getProUserById, getProUsers } from './helpers/prisma/scripts';
import { generateId } from 'lucia';

vi.mock('./lib/server/prisma');

const fakeUser = {
	id: generateId(15),
	username: 'demoname',
	email: 'example@prisma.com',
	email_verified: false,
	hashed_password: 'hashedpass',
	created_at: new Date(),
	stripe_id: null,
	role: UserRole.BASE,
	bike_ftp: 0,
	run_ftp: 0,
	swim_ftp: 0,
	unit_type: UnitType.METRIC,
	max_hr: 0
};

test('createUser should return the generated user', async () => {
	prisma.user.create.mockResolvedValue({ ...fakeUser });

	const user = await createUser(fakeUser);
	expect(user).toStrictEqual({ ...fakeUser });
});
// test('index page has expected h1', async ({ page }) => {
// 	await page.goto('/');
// 	await expect(page.getByRole('heading', { name: 'Welcome to SvelteKit' })).toBeVisible();
// });

test('getProUsers', async () => {
	prisma.user.findMany.mockResolvedValueOnce([{ ...fakeUser, role: UserRole.PRO }]);

	const pros = await getProUsers({
		where: {
			role: UserRole.PRO
		}
	});
	expect(pros).toStrictEqual([{ ...fakeUser, role: UserRole.PRO }]);
});

test('getPostByID should throw an error', async () => {
	prisma.user.findUniqueOrThrow.mockImplementation(() => {
		throw new Error('There was an error.');
	});

	await expect(getProUserById("bad_id")).rejects.toThrow();
	await expect(getProUserById("bad_id")).rejects.toThrowError('There was an error');
});
