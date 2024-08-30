import dayjs from 'dayjs';
import { createInsertSchema } from 'drizzle-zod';
import type { Infer } from 'sveltekit-superforms';
import { z } from 'zod';
import {
	activityType,
	thirdPartyIntegrationProvider,
	user
} from './drizzle/schema';
import { WahooWorkoutTypeID } from './integrations/wahoo/types';
import { addDays } from './utils/datetime';

const oneUpperCaseLetter: RegExp = new RegExp('.*[A-Z].*');
const oneLowerCaseLetter: RegExp = new RegExp('.*[a-z].*');
const oneNumber: RegExp = new RegExp('.*\\d.*');
const oneSpecialChar: RegExp = new RegExp(
	'.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'
);
const alphanumericWithUnderscore: RegExp = new RegExp('^[A-Za-z0-9_]+$');

const passwordSchema = z
	.string()
	.regex(oneUpperCaseLetter, 'One uppercase character')
	.regex(oneLowerCaseLetter, 'One lowercase character')
	.regex(oneNumber, 'One number')
	.regex(oneSpecialChar, 'One special character')
	.min(8, 'Must be at least 8 characters in length');

export const signupSchema = createInsertSchema(user)
	.pick({ email: true, username: true, password: true })
	.extend({
		valPassword: z.string()
	})
	.superRefine(({ valPassword, password }, ctx) => {
		if (valPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['valPassword']
			});
		}
	});
export type SignUpSchema = typeof signupSchema;

export const signinSchema = z.object({
	email_or_username: z.string(),
	password: z.string()
});
export type SignInSchema = typeof signinSchema;

export const updateUserSchema = z.object({
	username: passwordSchema
});

export type UpdateUserSchema = typeof updateUserSchema;

export const verifyUserEmailSchema = z.object({
	code: z.string()
});
export type VerifyUserEmailSchema = typeof verifyUserEmailSchema;

export const updateUserEmailSchema = z.object({
	email: z.string().email(),
	code: z.string()
});
export type UpdateUserEmailSchema = typeof updateUserEmailSchema;

export const sendNewUserEmailCodeSchema = z.object({
	email: z.string().email()
});
export type SendNewUserEmailCode = typeof sendNewUserEmailCodeSchema;

export const updateUserPasswordSchema = z
	.object({
		password: passwordSchema,
		valPassword: z.string()
	})
	.superRefine(({ valPassword, password }, ctx) => {
		if (valPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['valPassword']
			});
		}
	});
export type UpdateUserPasswordSchema = typeof updateUserPasswordSchema;

export const forgotPassSchema = z.object({
	email: z.string().email()
});
export type ForgotPassSchema = typeof forgotPassSchema;

export const resetForgotPassSchema = z
	.object({
		code: z.string(),
		password: passwordSchema,
		valPassword: z.string()
	})
	.superRefine(({ valPassword, password }, ctx) => {
		if (valPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['valPassword']
			});
		}
	});
export type ResetForgotPassSchema = typeof resetForgotPassSchema;

export const resetPassSchema = z
	.object({
		password: passwordSchema,
		valPassword: z.string()
	})
	.superRefine(({ valPassword, password }, ctx) => {
		if (valPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['valPassword']
			});
		}
	});
export type ResetPassSchema = typeof resetPassSchema;

export const updateFtpHrSchema = z.object({
	max_hr: z.number(),
	runFtp: z.number().nonnegative().max(15), // m/s
	bikeFtp: z.number().min(1).max(500), // watts
	swimFtp: z.number().nonnegative().max(10) // m/s
});

export type UpdateFTP_HRSchema = typeof updateFtpHrSchema;

export const cancelUserSubscriptionSchema = z.object({
	password: z.string()
});

export type CancelUserSubscription = typeof cancelUserSubscriptionSchema;

export const deleteUserSchema = z.object({
	password: z.string()
});

export type DeleteUserSchema = typeof deleteUserSchema;

const ProviderEnum = z.enum(thirdPartyIntegrationProvider.enumValues);
type ProviderEnum = z.infer<typeof ProviderEnum>;
export const disconnectUserIntegrationSchema = z.object({
	provider: ProviderEnum
});

export type DisconnectUserIntegrationSchema =
	typeof disconnectUserIntegrationSchema;

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

export const newImageSchema = z.object({
	image: z
		.instanceof(File, { message: 'Please upload an image.' })
		.refine((f) => f.size < 5_120_000, 'Max 5 Mb upload size.')
});
export type NewImageSchema = typeof newImageSchema;

export const newClubSchema = z.object({
	name: z.string().max(100, 'Must be at most 100 characters long'),
	description: z.string().max(200, 'Must be at most 200 characters long'),
	private: z.boolean().default(false)
});
export type NewClubSchema = typeof newClubSchema;

export const acceptClubMember = z.object({
	userId: z.string()
});

export type AcceptClubMember = typeof acceptClubMember;

export enum RecurrenceFrequency {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	BIWEEKLY = 'BIWEEKLY',
	MONTHLY = 'MONTHLY'
}

export const newClubEventSchema = z
	.object({
		trainingSessionId: z.number().optional(),
		date: z.date(),
		name: z.string().max(50, 'Must be at most 50 characters long'),
		description: z.string().max(200, 'Must be at most 200 characters long'),
		recurring: z.boolean().default(false),
		endDate: z.date().default(new Date()),
		frequency: z
			.nativeEnum(RecurrenceFrequency)
			.default(RecurrenceFrequency.WEEKLY)
	})
	.superRefine(({ date, endDate, recurring }, ctx) => {
		if (date <= dayjs().add(-1, 'day').startOf('day').toDate()) {
			ctx.addIssue({
				code: 'custom',
				message: 'The Date Cannot be before today.',
				path: ['date']
			});
		}
		if (endDate < date && recurring) {
			ctx.addIssue({
				code: 'custom',
				message: 'The End Date Cannot be Before the Start Date.',
				path: ['endDate']
			});
		}
	});

export type NewClubEventSchema = typeof newClubEventSchema;

export const trainingPlanSchema = z
	.object({
		name: z.string(),
		description: z.string().max(50, 'Must be at most 50 characters in length'),
		startDate: z.date(),
		endDate: z.date()
	})
	.superRefine(({ startDate, endDate }, ctx) => {
		if (endDate < startDate) {
			ctx.addIssue({
				code: 'custom',
				message: 'The End Date Cannot be Before the Start Date.',
				path: ['endDate']
			});
		}
	});
export type TrainPlanSchema = typeof trainingPlanSchema;

export const IntervalSchema = z.object({
	duration: z.number().min(0).nonnegative(),
	intensity: z.number().min(0).nonnegative(),
	distance: z.number().min(0).nonnegative().optional(),
	power: z.number().min(0).nonnegative().optional(),
	hr: z.number().min(0).nonnegative().optional()
});
export type Interval = z.infer<typeof IntervalSchema>;
export type WorkoutInterval = z.infer<typeof IntervalSchema>;

export const trainingSessionSchema = z.object({
	title: z.string(),
	activityType: z.enum(activityType.enumValues),
	description: z.string().max(250, 'Must be at most 250 characters in length'),
	// date: z.date(),
	duration: z.number().default(0),
	distance: z.number().optional(),
	stressScore: z.number().gte(0),
	plan: z.array(IntervalSchema)
});
export type TrainingSessionSchema = typeof trainingSessionSchema;

export const createWahooWorkoutSchema = z
	.object({
		name: z.string(),
		workout_type_id: z.nativeEnum(WahooWorkoutTypeID),
		starts: z.date(),
		minutes: z.number(),
		workoutToken: z.string(),
		planId: z.number().optional(),
		workoutSummaryId: z.any().optional()
	})
	.superRefine(({ starts }, ctx) => {
		if (starts > addDays(new Date(), 6)) {
			ctx.addIssue({
				code: 'custom',
				message:
					'The workout can not be scheduled in wahoo by more than 6 days in advance.',
				path: ['starts']
			});
		}
	});
export type CreateWahooWorkoutSchema = typeof createWahooWorkoutSchema;

export const userFeedSchema = z.object({
	page: z.number(),
	limit: z.number(),
	size: z.number(),
	amounts: z.array(z.number())
});
export const UserFeedSchema = typeof userFeedSchema;

type ProductConfig = Record<
	string,
	{ features: string[]; callToAction: string }
>;

export const productConfig: ProductConfig = {
	Free: {
		features: [
			'✅ Up to 5 Contacts',
			'❌ Community Support',
			'❌ Automatic Backups',
			'❌ 24/7 Customer Support',
			'❌ SSO'
		],
		callToAction: 'Get Started'
	},
	Plus: {
		features: [
			'✅ Up to 25 Contacts',
			'✅ Community Support',
			'✅ Automatic Backups',
			'❌ 24/7 Customer Support',
			'❌ SSO'
		],
		callToAction: 'Start Free Trial'
	},
	Pro: {
		features: [
			'✅ Unlimited Contacts',
			'✅ Community Support',
			'✅ Automatic Backups',
			'✅ 24/7 Customer Support',
			'✅ SSO'
		],
		callToAction: 'Start Free Trial'
	}
};

export const freePrice = {
	id: '',
	unitAmount: 0,
	interval: 'forever',
	product: {
		name: 'Free',
		description: 'For limited personal use',
		features: productConfig.Free.features,
		callToAction: productConfig.Free.callToAction
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
			callToAction: productConfig[product.name].callToAction
		};
	});

const priceSchema = z.object({
	id: z.string(),
	lookupKey: z.string(),
	unitAmount: z.number().transform((amount) => amount / 100),
	product: priceProductSchema
});

export const priceListSchema = z.array(priceSchema);

export const timeSchema = z.object({
	hours: z.number().max(23).min(0).default(0),
	minutes: z.number().max(59).min(0).default(0),
	seconds: z.number().max(59).min(0).default(0)
});

export type TimeSchema = Infer<typeof timeSchema>;

export enum ActivityFrequency {
	WEEK = 'week',
	MONTH = 'month',
	YEAR = 'year'
}

export const consistencyChartSchema = z.object({
	frequency: z.nativeEnum(ActivityFrequency)
});

export type ConsistencyChartSchema = Infer<typeof consistencyChartSchema>;
