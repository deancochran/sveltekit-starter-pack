import {
	boolean,
	doublePrecision,
	index,
	integer,
	json,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	varchar
} from 'drizzle-orm/pg-core';

export const activityType = pgEnum('ActivityType', ['SWIM', 'BIKE', 'RUN']);
export const friendshipStatus = pgEnum('FriendshipStatus', [
	'REQUESTED',
	'ACCEPTED',
	'BLOCKED',
	'DECLINED'
]);
export const thirdPartyIntegrationProvider = pgEnum(
	'ThirdPartyIntegrationProvider',
	['STRAVA', 'WAHOO']
);
export const unitType = pgEnum('UnitType', ['IMPERIAL', 'METRIC']);
export const userRole = pgEnum('UserRole', ['PRO', 'BASE', 'TRIAL']);

export const activities = pgTable(
	'activities',
	{
		id: serial('id').primaryKey().notNull(),
		type: activityType('type').notNull(),
		distance: doublePrecision('distance').notNull(),
		duration: integer('duration').notNull(),
		date: timestamp('date', { mode: 'date' }).defaultNow().notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		stressScore: doublePrecision('stress_score').notNull(),
		thirdpartyLogId: integer('thirdparty_log_id').references(
			() => thirdPartyIntegrationLogs.id,
			{
				onDelete: 'set null',
				onUpdate: 'cascade'
			}
		),
		intensityFactorScore: doublePrecision('intensity_factor_score').notNull(),
		externalId: text('external_id')
	},
	(table) => {
		return {
			idKey: uniqueIndex('activities_id_key').using('btree', table.id),
			thirdpartyLogIdKey: uniqueIndex('activities_thirdparty_log_id_key').using(
				'btree',
				table.thirdpartyLogId
			)
		};
	}
);

export const subscription = pgTable(
	'subscription',
	{
		userId: text('user_id')
			.primaryKey()
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		cancelAt: timestamp('cancel_at', { mode: 'date' }),
		cancelAtPeriodEnd: boolean('cancel_at_period_end'),
		canceledAt: timestamp('canceled_at', { mode: 'date' }),
		currentPeriodStart: timestamp('current_period_start', {
			mode: 'date'
		}).notNull(),
		currentPeriodEnd: timestamp('current_period_end', {
			mode: 'date'
		}).notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		endedAt: timestamp('ended_at', { mode: 'date' }),
		startDate: timestamp('start_date', { mode: 'date' }).notNull(),
		trialStart: timestamp('trial_start', { mode: 'date' }),
		trialEnd: timestamp('trial_end', { mode: 'date' }),
		metadata: jsonb('metadata').notNull(),
		status: text('status').notNull(),
		stripeSubId: text('stripe_sub_id').notNull()
	},
	(table) => {
		return {
			stripeSubIdKey: uniqueIndex('subscription_stripe_sub_id_key').using(
				'btree',
				table.stripeSubId
			),
			userIdIdx: index('subscription_user_id_idx').using('btree', table.userId),
			userIdKey: uniqueIndex('subscription_user_id_key').using(
				'btree',
				table.userId
			)
		};
	}
);

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey().notNull(),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		expiresAt: timestamp('expiresAt', {
			withTimezone: true,
			mode: 'date'
		}).notNull()
	},
	(table) => {
		return {
			idKey: uniqueIndex('session_id_key').using('btree', table.id)
		};
	}
);

export const key = pgTable(
	'key',
	{
		id: text('id').primaryKey().notNull(),
		password: text('hashed_password'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			idKey: uniqueIndex('key_id_key').using('btree', table.id)
		};
	}
);

export const passwordResetToken = pgTable(
	'passwordResetToken',
	{
		id: serial('id').primaryKey().notNull(),
		hashedCode: text('hashed_code').notNull(),
		expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
	},
	(table) => {
		return {
			hashedCodeKey: uniqueIndex('passwordResetToken_hashed_code_key').using(
				'btree',
				table.hashedCode
			)
		};
	}
);

export const emailVerificationToken = pgTable('emailVerificationToken', {
	id: serial('id').primaryKey().notNull(),
	code: text('code').notNull(),
	expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const thirdPartyIntegrationToken = pgTable(
	'thirdPartyIntegrationToken',
	{
		id: serial('id').primaryKey().notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		provider: thirdPartyIntegrationProvider('provider').notNull(),
		expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
		accessToken: text('access_token').notNull(),
		refreshToken: text('refresh_token').notNull(),
		integrationId: text('integration_id').notNull()
	},
	(table) => {
		return {
			integrationIdKey: uniqueIndex(
				'thirdPartyIntegrationToken_integration_id_key'
			).using('btree', table.integrationId)
		};
	}
);

export const thirdPartyIntegrationLogs = pgTable('thirdPartyIntegrationLogs', {
	id: serial('id').primaryKey().notNull(),
	provider: thirdPartyIntegrationProvider('provider').notNull(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	metadata: jsonb('metadata').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	tokenId: integer('token_id')
		.notNull()
		.references(() => thirdPartyIntegrationToken.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		})
});

export const trainingSession = pgTable('trainingSession', {
	id: serial('id').primaryKey().notNull(),
	title: text('title').notNull(),
	activityType: activityType('activity_type').notNull(),
	description: text('description'),
	distance: integer('distance'),
	duration: integer('duration').notNull(),
	stressScore: doublePrecision('stress_score').notNull(),
	plan: json('plan').array(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const user = pgTable(
	'user',
	{
		id: text('id').primaryKey().notNull(),
		username: text('username').notNull(),
		email: text('email').notNull(),
		emailVerified: boolean('email_verified').default(false).notNull(),
		password: text('password').notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		stripeId: text('stripe_id'),
		role: userRole('role').default('BASE').notNull(),
		bikeFtp: integer('bike_ftp').default(0).notNull(),
		runFtp: integer('run_ftp').default(0).notNull(),
		swimFtp: integer('swim_ftp').default(0).notNull(),
		unitType: unitType('unit_type').default('METRIC').notNull(),
		maxHr: integer('max_hr').default(0).notNull(),
		private: boolean('private').default(true).notNull(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
		avatarFileId: text('avatar_file_id'),
		bannerFileId: text('banner_file_id')
	},
	(table) => {
		return {
			emailKey: uniqueIndex('user_email_key').using('btree', table.email),
			idIdx: index('user_id_idx').using('btree', table.id),
			idKey: uniqueIndex('user_id_key').using('btree', table.id),
			stripeIdKey: uniqueIndex('user_stripe_id_key').using(
				'btree',
				table.stripeId
			),
			usernameKey: uniqueIndex('user_username_key').using(
				'btree',
				table.username
			)
		};
	}
);

export const prismaMigrations = pgTable('_prisma_migrations', {
	id: varchar('id', { length: 36 }).primaryKey().notNull(),
	checksum: varchar('checksum', { length: 64 }).notNull(),
	finishedAt: timestamp('finished_at', { withTimezone: true, mode: 'string' }),
	migrationName: varchar('migration_name', { length: 255 }).notNull(),
	logs: text('logs'),
	rolledBackAt: timestamp('rolled_back_at', {
		withTimezone: true,
		mode: 'string'
	}),
	startedAt: timestamp('started_at', { withTimezone: true, mode: 'string' })
		.defaultNow()
		.notNull(),
	appliedStepsCount: integer('applied_steps_count').default(0).notNull()
});

export const clubEvent = pgTable('club_event', {
	id: serial('id').primaryKey().notNull(),
	clubId: integer('club_id')
		.notNull()
		.references(() => club.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	date: timestamp('date', { mode: 'date' }).notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	trainingSessionId: integer('training_session_id').references(
		() => trainingSession.id,
		{
			onDelete: 'set null',
			onUpdate: 'cascade'
		}
	),
	recurrenceId: text('recurrence_id')
});

export const club = pgTable('club', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
	avatarFileId: text('avatar_file_id'),
	bannerFileId: text('banner_file_id'),
	private: boolean('private').default(false).notNull()
});

export const likedTrainingSession = pgTable(
	'likedTrainingSession',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		trainingSessionId: integer('training_session_id')
			.notNull()
			.references(() => trainingSession.id, {
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
		timestamp: timestamp('timestamp', { mode: 'date' }).defaultNow().notNull()
	},
	(table) => {
		return {
			trainingSessionIdIdx: index(
				'likedTrainingSession_training_session_id_idx'
			).using('btree', table.trainingSessionId),
			userIdIdx: index('likedTrainingSession_user_id_idx').using(
				'btree',
				table.userId
			),
			userIdTrainingSessionIdKey: uniqueIndex(
				'likedTrainingSession_user_id_training_session_id_key'
			).using('btree', table.userId, table.trainingSessionId),
			likedTrainingSessionPkey: primaryKey({
				columns: [table.userId, table.trainingSessionId],
				name: 'likedTrainingSession_pkey'
			})
		};
	}
);

export const friendship = pgTable(
	'Friendship',
	{
		requesterId: text('requester_id')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		addresseeId: text('addressee_id')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
		status: friendshipStatus('status').notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).notNull()
	},
	(table) => {
		return {
			requesterIdAddresseeIdKey: uniqueIndex(
				'Friendship_requester_id_addressee_id_key'
			).using('btree', table.requesterId, table.addresseeId),
			friendshipPkey: primaryKey({
				columns: [table.requesterId, table.addresseeId],
				name: 'Friendship_pkey'
			})
		};
	}
);

export const clubMember = pgTable(
	'club_member',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		clubId: integer('club_id')
			.notNull()
			.references(() => club.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		admin: boolean('admin').default(false).notNull(),
		createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
		updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
		status: friendshipStatus('status').notNull()
	},
	(table) => {
		return {
			userIdClubIdKey: uniqueIndex('club_member_user_id_club_id_key').using(
				'btree',
				table.userId,
				table.clubId
			),
			clubMemberPkey: primaryKey({
				columns: [table.userId, table.clubId],
				name: 'club_member_pkey'
			})
		};
	}
);
