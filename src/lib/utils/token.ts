import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generatePasswordResetToken = async (userId: string) => {
	const storedUserTokens = await prisma.passwordResetToken.findMany({
		where: { user_id: userId }
	});
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const newToken = await prisma.passwordResetToken.create({
		data: {
			id: generateRandomString(63),
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
		
	});
	return newToken.id;
};

export const checkPasswordResetToken = async (token: string) => {
	const storedToken = await prisma.passwordResetToken.findUnique({
		where: { id: token }
	});
	if (!storedToken) return false;
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		return false;
	}
	return true;
};

export const validatePasswordResetToken = async (token: string): Promise<string> => {
	const storedToken = await prisma.$transaction(async (db) => {
		const obj = await db.passwordResetToken.findUnique({
			where: { id: token }
		});
		if (!obj) throw new Error('Invalid token');
		await db.passwordResetToken.deleteMany({
			where: { user_id: obj.user_id }
		});
		return obj;
	});
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await prisma.emailVerificationToken.findMany({
		where: { user_id: userId }
	});
	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((token) => {
			return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.id;
	}
	const newToken = await prisma.emailVerificationToken.create({
		data: {
			id: generateRandomString(8),
			expires: new Date().getTime() + EXPIRES_IN,
			user_id: userId
		}
	});
	return newToken.id;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await prisma.$transaction(async (db) => {
		const obj = await db.emailVerificationToken.findUnique({
			where: { id: token }
		});
		if (!obj) throw new Error('Invalid token');
		await db.emailVerificationToken.deleteMany({
			where: { user_id: obj.user_id }
		});
		return obj;
	});
	if (!storedToken) throw new Error('Invalid token');
	const tokenExpires = Number(storedToken.expires); // bigint => number conversion
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}
	return storedToken.user_id;
};
