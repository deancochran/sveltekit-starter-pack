// script.ts
import { type Prisma } from '@prisma/client';
import { prisma } from '$lib/server/prisma';
export const createUser = async (user: Prisma.userCreateInput) => {
	return await prisma.user.create({
		data: user
	});
};

export const getProUsers = async (conditions: Prisma.userFindManyArgs) => {
	return await prisma.user.findMany(conditions);
};

export const getProUserById = async (id: string) => {
	return await prisma.user.findMany({
		where: {
			id: id
		}
	});
};
