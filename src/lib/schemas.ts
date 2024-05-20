import { ActivityType, ThirdPartyIntegrationProvider } from '@prisma/client';
import { z } from 'zod';
import { WahooWorkoutTypeID } from './utils/integrations/wahoo/types';
import { addDays } from './utils/datetime';

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

export const verify_user_email_schema = z.object({
	code: z.string()
});
export type VerifyUserEmailSchema = typeof verify_user_email_schema;

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
		code: z.string(),
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

export const update_ftp_hr_schema = z.object({
	max_hr: z.number(),
	run_ftp: z.number(),
	bike_ftp: z.number(),
	swim_ftp: z.number()
});
export type UpdateFTP_HRSchema = typeof update_ftp_hr_schema;

export const cancel_user_subscription_schema = z.object({
	password: z.string()
});

export type CancelUserSubscription = typeof cancel_user_subscription_schema;

export const delete_user_schema = z.object({
	password: z.string()
});

export type DeleteUserSchema = typeof delete_user_schema;

const ProviderEnum = z.nativeEnum(ThirdPartyIntegrationProvider);
type ProviderEnum = z.infer<typeof ProviderEnum>;
export const disconnect_user_integration_schema = z.object({
	provider: ProviderEnum
});

export type DisconnectUserIntegrationSchema = typeof disconnect_user_integration_schema;

export const stripeProductSchema = z.object({
	id: z.string(),
	name: z.string(),
	active: z.boolean(),
	description: z.string().max(50, 'Must be at most 50 characters in length'),
	metadata: z.record(z.string())
});

export const stripeCustomerSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	metadata: z.record(z.string())
});

export const training_plan_schema = z
	.object({
		name: z.string(),
		description: z.string().max(50, 'Must be at most 50 characters in length'),
		start_date: z.date(),
		end_date: z.date()
	})
	.superRefine(({ start_date, end_date }, ctx) => {
		if (end_date < start_date) {
			ctx.addIssue({
				code: 'custom',
				message: 'The End Date Cannot be Before the Start Date.',
				path: ['end_date']
			});
		}
	});
export type TrainPlanSchema = typeof training_plan_schema;

export const IntervalSchema = z.object({
	duration: z.number().min(0).default(0),
	distance: z.number().optional(),
	intensity: z.number().min(0).nonnegative()
});
export type Interval = z.infer<typeof IntervalSchema>;
export type WorkoutInterval = z.infer<typeof IntervalSchema>;

export const training_session_schema = z.object({
	title: z.string(),
	activity_type: z.nativeEnum(ActivityType),
	description: z.string().max(250, 'Must be at most 250 characters in length'),
	date: z.date(),
	duration: z.number().default(0),
	distance: z.number().optional(),
	stress_score: z.number().gte(0),
	plan: z.array(IntervalSchema),
	training_plan_id: z.number()
});
export type TrainingSessionSchema = typeof training_session_schema;

export const create_wahoo_workout_schema = z
	.object({
		name: z.string(),
		workout_type_id: z.nativeEnum(WahooWorkoutTypeID),
		starts: z.date(),
		minutes: z.number(),
		workout_token: z.string(),
		plan_id: z.number().optional(),
		workout_summary_id: z.any().optional()
	})
	.superRefine(({ starts }, ctx) => {
		const today = new Date().setUTCHours(0, 0, 0, 0);
		const dateToCheck = starts.setUTCHours(0, 0, 0, 0);
		if (!(dateToCheck >= today)) {
			ctx.addIssue({
				code: 'custom',
				message: 'The Date can not be before today.',
				path: ['starts']
			});
		} else if (starts > addDays(new Date(), 6)) {
			ctx.addIssue({
				code: 'custom',
				message: 'The workout can not be scheduled in wahoo by more than 6 days in advance.',
				path: ['starts']
			});
		}
	});
export type CreateWahooWorkoutSchema = typeof create_wahoo_workout_schema;

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
