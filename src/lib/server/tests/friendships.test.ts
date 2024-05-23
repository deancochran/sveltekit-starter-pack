import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('./src/lib/server/prisma');

describe('dexample', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});
	describe('example test', async () => {
		it('1==1', async () => {
			expect(1).toStrictEqual(1);
		});
	});
});
