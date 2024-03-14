import type { emailVerificationToken, user } from '@prisma/client';
import { error } from '@sveltejs/kit';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import * as argon from 'argon2';

export async function generatePasswordResetToken(user_id: string): Promise<string> {
	const new_code = await prisma.$transaction(async (db) => {
		await db.passwordResetToken.deleteMany({
			where: { user_id: user_id }
		});
		const new_code = generateRandomString(8, alphabet('0-9', 'A-Z', 'a-z'));
		const hashed_code = encodeHex(await sha256(new TextEncoder().encode(new_code)));
		await db.passwordResetToken.create({
			data: {
				hashed_code: hashed_code,
				expires_at: createDate(new TimeSpan(15, 'm')), // 15 minutes
				user_id: user_id
			}
		});
		return new_code;
	});
	return new_code;
}

export const validatePasswordResetToken = async (code: string, password: string): Promise<user> => {
	const user = await prisma.$transaction(async (db) => {
		const hashed_code = encodeHex(await sha256(new TextEncoder().encode(code)));
		const token = await db.passwordResetToken.findFirstOrThrow({
			where: { hashed_code: hashed_code }
		});
		if (!isWithinExpirationDate(token.expires_at)) {
			throw error(404, { code: '404', message: 'expired code' });
		}
		const hashed_password = await argon.hash(password);
		const user = await prisma.user.update({
			where: {
				id: token.user_id
			},
			data: {
				hashed_password: hashed_password
			}
		});
		await db.passwordResetToken.deleteMany({
			where: { user_id: token.user_id }
		});
		return user;
	});
	return user;
};

export async function generateEmailVerificationToken(
	userId: string
): Promise<emailVerificationToken> {
	const new_token = await prisma.$transaction(async (db) => {
		await db.emailVerificationToken.deleteMany({
			where: { user_id: userId }
		});
		const new_code = generateRandomString(8, alphabet('0-9'));
		return await db.emailVerificationToken.create({
			data: {
				code: new_code,
				expires_at: createDate(new TimeSpan(15, 'm')), // 15 minutes
				user_id: userId
			}
		});
	});
	return new_token;
}

export const validateEmailVerificationToken = async (code: string): Promise<user> => {
	const user = await prisma.$transaction(async (db) => {
		const token = await db.emailVerificationToken.findFirstOrThrow({
			where: { code: code }
		});
		if (!isWithinExpirationDate(token.expires_at)) {
			throw error(404, { code: '404', message: 'expired code' });
		}
		const user = await prisma.user.update({
			where: {
				id: token.user_id
			},
			data: {
				email_verified: true
			}
		});
		await db.emailVerificationToken.deleteMany({
			where: { user_id: token.user_id }
		});
		return user;
	});
	return user;
};
