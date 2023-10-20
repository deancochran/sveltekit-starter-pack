import { z } from 'zod';

const one_upper_case_letter: RegExp = new RegExp('.*[A-Z].*');
const one_lower_case_letter: RegExp = new RegExp('.*[a-z].*');
const one_number: RegExp = new RegExp('.*\\d.*');
const one_special_char: RegExp = new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*');
const alphanumeric_with_underscore: RegExp = new RegExp('^[A-Za-z0-9_]+$');

export const signup_schema = z
	.object({
		email: z.string().email(),
		username: z
			.string()
			.regex(alphanumeric_with_underscore, 'Must must be alaphanumeric, "_" is allowed')
			.max(20, 'Must be at most 20 characters in length')
			.min(8, 'Must be at least 8 characters in length'),
		password: z
			.string()
			.regex(one_upper_case_letter, 'One uppercase character')
			.regex(one_lower_case_letter, 'One lowercase character')
			.regex(one_number, 'One number')
			.regex(one_special_char, 'One special character')
			.min(8, 'Must be at least 8 characters in length'),
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

export const forgot_pass_schema = z.object({
	email: z.string().email(),
});
export type ForgotPassSchema = typeof forgot_pass_schema;

export const reset_forgot_pass_schema = z
.object({
	password: z
		.string()
		.regex(one_upper_case_letter, 'One uppercase character')
		.regex(one_lower_case_letter, 'One lowercase character')
		.regex(one_number, 'One number')
		.regex(one_special_char, 'One special character')
		.min(8, 'Must be at least 8 characters in length'),
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
export type ResetForgotPassSchema = typeof reset_forgot_pass_schema;

export const reset_pass_schema = z
.object({
	password: z
		.string()
		.regex(one_upper_case_letter, 'One uppercase character')
		.regex(one_lower_case_letter, 'One lowercase character')
		.regex(one_number, 'One number')
		.regex(one_special_char, 'One special character')
		.min(8, 'Must be at least 8 characters in length'),
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
