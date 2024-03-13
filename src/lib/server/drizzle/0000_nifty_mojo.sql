-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "ActivityType" AS ENUM('SWIM', 'BIKE', 'RUN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "UserRole" AS ENUM('PRO', 'BASE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "ThirdPartyIntegrationProvider" AS ENUM('STRAVA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "UnitType" AS ENUM('IMPERIAL', 'METRIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"stripe_id" text,
	"role" "UserRole" DEFAULT 'BASE',
	"bike_ftp" integer DEFAULT 100 NOT NULL,
	"run_ftp" integer DEFAULT 480 NOT NULL,
	"swim_ftp" integer DEFAULT 240 NOT NULL,
	"unitType" "UnitType" DEFAULT 'METRIC' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"user_id" text PRIMARY KEY NOT NULL,
	"cancel_at" timestamp(3),
	"cancel_at_period_end" boolean,
	"canceled_at" timestamp(3),
	"current_period_start" timestamp(3) NOT NULL,
	"current_period_end" timestamp(3) NOT NULL,
	"created" timestamp(3) NOT NULL,
	"ended_at" timestamp(3),
	"start_date" timestamp(3) NOT NULL,
	"trial_start" timestamp(3),
	"trial_end" timestamp(3),
	"metadata" jsonb NOT NULL,
	"status" text NOT NULL,
	"stripe_sub_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "key" (
	"id" text PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passwordResetToken" (
	"id" text PRIMARY KEY NOT NULL,
	"expires" bigint,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emailVerificationToken" (
	"id" text PRIMARY KEY NOT NULL,
	"expires" bigint,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thirdPartyIntegrationToken" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" "ThirdPartyIntegrationProvider",
	"expires_at" bigint NOT NULL,
	"expires_in" bigint NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"integration_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thirdPartyIntegrationLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" "ThirdPartyIntegrationProvider",
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"metadata" jsonb NOT NULL,
	"user_id" text NOT NULL,
	"token_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"eventType" "ActivityType" NOT NULL,
	"date" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"all_day" boolean NOT NULL,
	"start" timestamp(3),
	"end" timestamp(3),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"calendar_id" integer NOT NULL,
	"training_plan_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "ActivityType" NOT NULL,
	"distance" double precision NOT NULL,
	"duration" integer NOT NULL,
	"date" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" text NOT NULL,
	"stress_score" double precision NOT NULL,
	"thirdparty_log_id" integer,
	"intensity_factor_score" double precision NOT NULL,
	"event_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trainingPlan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"startDate" timestamp(3) NOT NULL,
	"endDate" timestamp(3) NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_key" ON "user" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_username_key" ON "user" ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_stripe_id_key" ON "user" ("stripe_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_user_id_key" ON "subscription" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_stripe_sub_id_key" ON "subscription" ("stripe_sub_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_user_id_idx" ON "subscription" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "session_id_key" ON "session" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "key_id_key" ON "key" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passwordResetToken_id_key" ON "passwordResetToken" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailVerificationToken_id_key" ON "emailVerificationToken" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "thirdPartyIntegrationToken_integration_id_key" ON "thirdPartyIntegrationToken" ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "calendar_user_id_key" ON "calendar" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_date_idx" ON "event" ("date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "activities_id_key" ON "activities" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "activities_thirdparty_log_id_key" ON "activities" ("thirdparty_log_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "trainingPlan_startDate_endDate_idx" ON "trainingPlan" ("startDate","endDate");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "key" ADD CONSTRAINT "key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwordResetToken" ADD CONSTRAINT "passwordResetToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emailVerificationToken" ADD CONSTRAINT "emailVerificationToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thirdPartyIntegrationToken" ADD CONSTRAINT "thirdPartyIntegrationToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thirdPartyIntegrationLogs" ADD CONSTRAINT "thirdPartyIntegrationLogs_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "public"."thirdPartyIntegrationToken"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thirdPartyIntegrationLogs" ADD CONSTRAINT "thirdPartyIntegrationLogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar" ADD CONSTRAINT "calendar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "public"."calendar"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_training_plan_id_fkey" FOREIGN KEY ("training_plan_id") REFERENCES "public"."trainingPlan"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_thirdparty_log_id_fkey" FOREIGN KEY ("thirdparty_log_id") REFERENCES "public"."thirdPartyIntegrationLogs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainingPlan" ADD CONSTRAINT "trainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/