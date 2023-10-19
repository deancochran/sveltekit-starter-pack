import { z } from 'zod';
export const signup_schema = z
	.object({
		email: z.string().email(),
		username: z.string(),
		password: z.string(),
		val_password: z.string()
	})
	.superRefine(({ val_password, password }, ctx) => {
		if (val_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['val_password']
			});
		}
	});
export type SignUpSchema = typeof signup_schema;

export const signin_schema = z.object({
	email: z.string().email(),
	password: z.string()
});
export type SignInSchema = typeof signin_schema;

export const reset_pass_schema = z
	.object({
		password: z.string(),
		val_password: z.string()
	})
	.superRefine(({ val_password, password }, ctx) => {
		if (val_password !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['val_password']
			});
		}
	});
export type ResetPassSchema = typeof reset_pass_schema;

export const resend_reset_pass_schema = z.object({});
export type ResendResetPassSchema = typeof resend_reset_pass_schema;
