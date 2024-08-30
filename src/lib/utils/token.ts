import { db } from '$lib/drizzle/client';
import {
	emailVerificationToken,
	passwordResetToken,
	user
} from '$lib/drizzle/schema';
import * as argon from 'argon2';
import { eq, type InferSelectModel } from 'drizzle-orm';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString, sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';

export async function generatePasswordResetToken(
	userId: string
): Promise<string> {
	return await db.transaction(async (ctx) => {
		await ctx
			.delete(passwordResetToken)
			.where(eq(passwordResetToken.userId, userId));
		const newCode = generateRandomString(8, alphabet('0-9', 'A-Z', 'a-z'));
		const hashedCode = encodeHex(
			await sha256(new TextEncoder().encode(newCode))
		);

		await ctx.insert(passwordResetToken).values({
			hashedCode: hashedCode,
			expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes
			userId: userId
		});

		return newCode;
	});
}

export async function validatePasswordResetToken(
	code: string,
	password: string
) {
	await db.transaction(async (ctx) => {
		const hashedCode = encodeHex(await sha256(new TextEncoder().encode(code)));
		const token = await ctx.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.hashedCode, hashedCode)
		});
		if (!token) throw new Error('No Token Found');
		if (!isWithinExpirationDate(token.expiresAt))
			throw new Error('Token is Expired');

		const hashedPassword = await argon.hash(password);
		await db
			.update(user)
			.set({
				password: hashedPassword
			})
			.where(eq(user.id, token.userId));

		await ctx
			.delete(passwordResetToken)
			.where(eq(passwordResetToken.userId, token.userId));
	});
}

export async function generateEmailVerificationToken(
	userId: string
): Promise<InferSelectModel<typeof emailVerificationToken>> {
	const [newToken] = await db.transaction(async (ctx) => {
		await ctx
			.delete(emailVerificationToken)
			.where(eq(emailVerificationToken.userId, userId));

		const newCode = generateRandomString(8, alphabet('0-9'));
		return await ctx
			.insert(emailVerificationToken)
			.values({
				code: newCode,
				expiresAt: createDate(new TimeSpan(15, 'm')), // 15 minutes
				userId: userId
			})
			.returning();
	});

	return newToken;
}

export async function validateEmailVerificationToken(code: string) {
	await db.transaction(async (tx) => {
		const token = await tx.query.emailVerificationToken.findFirst({
			where: eq(emailVerificationToken.code, code)
		});
		if (!token) throw new Error('Token has expired');
		if (!isWithinExpirationDate(token.expiresAt)) {
		}
		await tx
			.update(user)
			.set({
				emailVerified: true
			})
			.where(eq(user.id, token.userId));
		await tx
			.delete(emailVerificationToken)
			.where(eq(emailVerificationToken.userId, token.userId));
	});
}
