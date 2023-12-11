import { z } from 'zod';

const one_upper_case_letter: RegExp = new RegExp('.*[A-Z].*');
const one_lower_case_letter: RegExp = new RegExp('.*[a-z].*');
const one_number: RegExp = new RegExp('.*\\d.*');
const one_special_char: RegExp = new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*');
const alphanumeric_with_underscore: RegExp = new RegExp('^[A-Za-z0-9_]+$');

const username_schema = z
	.string()
	.regex(alphanumeric_with_underscore, 'Must must be alaphanumeric, "_" is allowed')
	.max(20, 'Must be at most 20 characters in length')
	.min(8, 'Must be at least 8 characters in length');
const password_schema = z
	.string()
	.regex(one_upper_case_letter, 'One uppercase character')
	.regex(one_lower_case_letter, 'One lowercase character')
	.regex(one_number, 'One number')
	.regex(one_special_char, 'One special character')
	.min(8, 'Must be at least 8 characters in length');

export const signup_schema = z
	.object({
		email: z.string().email(),
		username: username_schema,
		password: password_schema,
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

export const update_user_schema = z.object({
	username: username_schema
});

export type UpdateUserSchema = typeof update_user_schema;

export const update_user_email_schema = z.object({
	email: z.string().email(),
	code: z.string()
});
export type UpdateUserEmailSchema = typeof update_user_email_schema;

export const send_new_user_email_code_schema = z.object({
	email: z.string().email()
});
export type SendNewUserEmailCode = typeof send_new_user_email_code_schema;

export const update_user_password_schema = z
	.object({
		password: password_schema,
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
export type UpdateUserPasswordSchema = typeof update_user_password_schema;

export const forgot_pass_schema = z.object({
	email: z.string().email()
});
export type ForgotPassSchema = typeof forgot_pass_schema;

export const reset_forgot_pass_schema = z
	.object({
		password: password_schema,
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
		password: password_schema,
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

export const cancel_user_subscription_schema = z.object({
	password: z.string()
});

export type CancelUserSubscription = typeof cancel_user_subscription_schema;

export const delete_user_schema = z.object({
	password: z.string()
});

export type DeleteUserSchema = typeof delete_user_schema;

export const stripeProductSchema = z.object({
	id: z.string(),
	name: z.string(),
	active: z.boolean(),
	description: z.string(),
	metadata: z.record(z.string())
});

export const stripeCustomerSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	metadata: z.record(z.string())
});

type ProductConfig = Record<string, { features: string[]; call_to_action: string }>;

export const productConfig: ProductConfig = {
	Free: {
		features: [
			'✅ Up to 5 Contacts',
			'❌ Community Support',
			'❌ Automatic Backups',
			'❌ 24/7 Customer Support',
			'❌ SSO'
		],
		call_to_action: 'Get Started'
	},
	Plus: {
		features: [
			'✅ Up to 25 Contacts',
			'✅ Community Support',
			'✅ Automatic Backups',
			'❌ 24/7 Customer Support',
			'❌ SSO'
		],
		call_to_action: 'Start Free Trial'
	},
	Pro: {
		features: [
			'✅ Unlimited Contacts',
			'✅ Community Support',
			'✅ Automatic Backups',
			'✅ 24/7 Customer Support',
			'✅ SSO'
		],
		call_to_action: 'Start Free Trial'
	}
};

export const freePrice = {
	id: '',
	unit_amount: 0,
	interval: 'forever',
	product: {
		name: 'Free',
		description: 'For limited personal use',
		features: productConfig.Free.features,
		call_to_action: productConfig.Free.call_to_action
	}
};

const priceProductSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string()
	})
	.transform((product) => {
		return {
			...product,
			features: productConfig[product.name].features,
			call_to_action: productConfig[product.name].call_to_action
		};
	});

const priceSchema = z.object({
	id: z.string(),
	lookup_key: z.string(),
	unit_amount: z.number().transform((amount) => amount / 100),
	product: priceProductSchema
});

export const priceListSchema = z.array(priceSchema);
