// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { pgTable, pgEnum, varchar, timestamp, text, integer, uniqueIndex, index, boolean, foreignKey, jsonb, bigint, serial, doublePrecision } from "drizzle-orm/pg-core"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { sql } from "drizzle-orm"

  // ...other imports
// import { relations } from 'drizzle-orm';
// // ...other tables
// export const suppliersRelations = relations(suppliers, ({ many }) => ({
//   products: many(products),
// }));
// export const productsRelations = relations(products, ({ one, many }) => ({
//   supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
//   orderDetails: many(orderDetails),
// }));
// export const ordersRelations = relations(orders, ({ many }) => ({
//   orderDetails: many(orderDetails),
// }));
// export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
//   order: one(orders, { fields: [orderDetails.orderId], references: [orders.id] }),
//   product: one(products, { fields: [orderDetails.productId], references: [products.id] }),
// }));

export const ActivityType = pgEnum("activity_type", ['SWIM', 'BIKE', 'RUN'])
export const UserRole = pgEnum("user_role", ['PRO', 'BASE'])
export const IntegrationProvider = pgEnum("integration_provider", ['STRAVA'])
export const UnitType = pgEnum("unit_type", ['IMPERIAL', 'METRIC'])



export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	username: text("username").notNull(),
	email: text("email").notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone:true, mode: 'date' }).defaultNow().notNull(),
	stripeId: text("stripe_id").notNull(),
	role: UserRole("role").default('BASE'),
	bikeFtp: integer("bike_ftp").default(100).notNull(),
	runFtp: integer("run_ftp").default(480).notNull(),
	swimFtp: integer("swim_ftp").default(240).notNull(),
	unitType: UnitType("unit_type").default('METRIC').notNull(),
});

export const subscription = pgTable("subscription", {
	cancelAt: timestamp("cancel_at", { withTimezone:true, mode: 'date' }),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	canceledAt: timestamp("canceled_at", { withTimezone:true, mode: 'date' }),
	currentPeriodStart: timestamp("current_period_start", { withTimezone:true, mode: 'date' }).notNull(),
	currentPeriodEnd: timestamp("current_period_end", { withTimezone:true, mode: 'date' }).notNull(),
	created: timestamp("created", { withTimezone:true, mode: 'date' }).notNull(),
	endedAt: timestamp("ended_at", { withTimezone:true, mode: 'date' }),
	startDate: timestamp("start_date", { withTimezone:true, mode: 'date' }).notNull(),
	trialStart: timestamp("trial_start", { withTimezone:true, mode: 'date' }),
	trialEnd: timestamp("trial_end", { withTimezone:true, mode: 'date' }),
	metadata: jsonb("metadata").notNull(),
	status: text("status").notNull(),
	stripeSubId: text("stripe_sub_id").notNull(),

	userId: text("user_id").primaryKey().notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const session = pgTable("session", {
	id: text("id").primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone:true, mode: 'date' }).notNull(),

	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const key = pgTable("key", {
	id: text("id").primaryKey().notNull(),
	hashedPassword: text("hashed_password"),

	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const passwordResetToken = pgTable("passwordResetToken", {
	id: text("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expires: bigint("expires", { mode: "number" }),

	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const emailVerificationToken = pgTable("emailVerificationToken", {
	id: text("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expires: bigint("expires", { mode: "number" }),

	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const thirdPartyIntegrationToken = pgTable("thirdPartyIntegrationToken", {
	id: serial("id").primaryKey().notNull(),
	provider: IntegrationProvider("provider"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiresIn: bigint("expires_in", { mode: "number" }).notNull(),
	createdAt: timestamp("createdAt", { withTimezone:true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone:true, mode: 'date' }).notNull(),
	accessToken: text("access_token").notNull(),
	refreshToken: text("refresh_token").notNull(),
	integrationId: text("integration_id").notNull(),

	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const thirdPartyIntegrationLogs = pgTable("thirdPartyIntegrationLogs", {
	id: serial("id").primaryKey().notNull(),
	provider: IntegrationProvider("provider"),
	createdAt: timestamp("createdAt", { withTimezone:true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone:true, mode: 'date' }).notNull(),
	metadata: jsonb("metadata").notNull(),

	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	tokenId: integer("token_id").notNull().references(() => thirdPartyIntegrationToken.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const calendar = pgTable("calendar", {
	id: serial("id").primaryKey().notNull(),
	
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
});

export const event = pgTable("event", {
	id: serial("id").primaryKey().notNull(),
	eventType: ActivityType("eventType").notNull(),
	date: timestamp("date", { withTimezone:true, mode: 'date' }).defaultNow().notNull(),
	allDay: boolean("all_day").notNull(),
	start: timestamp("start", { withTimezone:true, mode: 'date' }),
	end: timestamp("end", { withTimezone:true, mode: 'date' }),
	title: text("title").notNull(),
	description: text("description").notNull(),

	calendarId: integer("calendar_id").notNull().references(() => calendar.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	trainingPlanId: integer("training_plan_id").references(() => trainingPlan.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const activities = pgTable("activities", {
	id: serial("id").primaryKey().notNull(),
	type: ActivityType("type").notNull(),
	distance: doublePrecision("distance").notNull(),
	duration: integer("duration").notNull(),
	date: timestamp("date", { withTimezone:true, mode: 'date' }).defaultNow().notNull(),
	stressScore: doublePrecision("stress_score").notNull(),
	intensityFactorScore: doublePrecision("intensity_factor_score").notNull(),

	thirdpartyLogId: integer("thirdparty_log_id").references(() => thirdPartyIntegrationLogs.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	eventId: integer("event_id").references(() => event.id, { onDelete: "set null", onUpdate: "cascade" } ),
});

export const trainingPlan = pgTable("trainingPlan", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	startDate: timestamp("startDate", { withTimezone:true, mode: 'date' }).notNull(),
	endDate: timestamp("endDate", { withTimezone:true, mode: 'date' }).notNull(),
	
	userId: text("userId").notNull().references(() => user.id, { onDelete: "restrict", onUpdate: "cascade" } ),
});