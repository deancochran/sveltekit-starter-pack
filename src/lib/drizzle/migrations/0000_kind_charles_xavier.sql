DO $$ BEGIN
 CREATE TYPE "public"."ActivityType" AS ENUM('SWIM', 'BIKE', 'RUN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."FriendshipStatus" AS ENUM('REQUESTED', 'ACCEPTED', 'BLOCKED', 'DECLINED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ThirdPartyIntegrationProvider" AS ENUM('STRAVA', 'WAHOO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."UnitType" AS ENUM('IMPERIAL', 'METRIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."UserRole" AS ENUM('PRO', 'BASE', 'TRIAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "ActivityType" NOT NULL,
	"distance" double precision NOT NULL,
	"duration" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"stress_score" double precision NOT NULL,
	"thirdparty_log_id" integer,
	"intensity_factor_score" double precision NOT NULL,
	"external_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "club" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"avatar_file_id" text,
	"banner_file_id" text,
	"private" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "club_event" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"training_session_id" integer,
	"recurrence_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "club_member" (
	"user_id" text NOT NULL,
	"club_id" integer NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"status" "FriendshipStatus" NOT NULL,
	CONSTRAINT "club_member_pkey" PRIMARY KEY("user_id","club_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emailVerificationToken" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Friendship" (
	"requester_id" text NOT NULL,
	"addressee_id" text NOT NULL,
	"status" "FriendshipStatus" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "Friendship_pkey" PRIMARY KEY("requester_id","addressee_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "key" (
	"id" text PRIMARY KEY NOT NULL,
	"hashed_password" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likedTrainingSession" (
	"user_id" text NOT NULL,
	"training_session_id" integer NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "likedTrainingSession_pkey" PRIMARY KEY("user_id","training_session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passwordResetToken" (
	"id" serial PRIMARY KEY NOT NULL,
	"hashed_code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
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
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"user_id" text PRIMARY KEY NOT NULL,
	"cancel_at" timestamp,
	"cancel_at_period_end" boolean,
	"canceled_at" timestamp,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	"start_date" timestamp NOT NULL,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"metadata" jsonb NOT NULL,
	"status" text NOT NULL,
	"stripe_sub_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thirdPartyIntegrationLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" "ThirdPartyIntegrationProvider" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb NOT NULL,
	"user_id" text NOT NULL,
	"token_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thirdPartyIntegrationToken" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" "ThirdPartyIntegrationProvider" NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"integration_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trainingSession" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"activity_type" "ActivityType" NOT NULL,
	"description" text,
	"distance" integer,
	"duration" integer NOT NULL,
	"stress_score" double precision NOT NULL,
	"plan" json[],
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"stripe_id" text,
	"role" "UserRole" DEFAULT 'BASE' NOT NULL,
	"bike_ftp" integer DEFAULT 0 NOT NULL,
	"run_ftp" integer DEFAULT 0 NOT NULL,
	"swim_ftp" integer DEFAULT 0 NOT NULL,
	"unit_type" "UnitType" DEFAULT 'METRIC' NOT NULL,
	"max_hr" integer DEFAULT 0 NOT NULL,
	"private" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp NOT NULL,
	"avatar_file_id" text,
	"banner_file_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_thirdparty_log_id_thirdPartyIntegrationLogs_id_fk" FOREIGN KEY ("thirdparty_log_id") REFERENCES "public"."thirdPartyIntegrationLogs"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "club_event" ADD CONSTRAINT "club_event_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "club_event" ADD CONSTRAINT "club_event_training_session_id_trainingSession_id_fk" FOREIGN KEY ("training_session_id") REFERENCES "public"."trainingSession"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "club_member" ADD CONSTRAINT "club_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "club_member" ADD CONSTRAINT "club_member_club_id_club_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."club"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emailVerificationToken" ADD CONSTRAINT "emailVerificationToken_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requester_id_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addressee_id_user_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "key" ADD CONSTRAINT "key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likedTrainingSession" ADD CONSTRAINT "likedTrainingSession_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likedTrainingSession" ADD CONSTRAINT "likedTrainingSession_training_session_id_trainingSession_id_fk" FOREIGN KEY ("training_session_id") REFERENCES "public"."trainingSession"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "passwordResetToken" ADD CONSTRAINT "passwordResetToken_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thirdPartyIntegrationLogs" ADD CONSTRAINT "thirdPartyIntegrationLogs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thirdPartyIntegrationLogs" ADD CONSTRAINT "thirdPartyIntegrationLogs_token_id_thirdPartyIntegrationToken_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."thirdPartyIntegrationToken"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thirdPartyIntegrationToken" ADD CONSTRAINT "thirdPartyIntegrationToken_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trainingSession" ADD CONSTRAINT "trainingSession_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "activities_id_key" ON "activities" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "activities_thirdparty_log_id_key" ON "activities" USING btree ("thirdparty_log_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "club_member_user_id_club_id_key" ON "club_member" USING btree ("user_id","club_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Friendship_requester_id_addressee_id_key" ON "Friendship" USING btree ("requester_id","addressee_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "key_id_key" ON "key" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likedTrainingSession_training_session_id_idx" ON "likedTrainingSession" USING btree ("training_session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "likedTrainingSession_user_id_idx" ON "likedTrainingSession" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "likedTrainingSession_user_id_training_session_id_key" ON "likedTrainingSession" USING btree ("user_id","training_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "passwordResetToken_hashed_code_key" ON "passwordResetToken" USING btree ("hashed_code");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "session_id_key" ON "session" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_stripe_sub_id_key" ON "subscription" USING btree ("stripe_sub_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_user_id_idx" ON "subscription" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_user_id_key" ON "subscription" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "thirdPartyIntegrationToken_integration_id_key" ON "thirdPartyIntegrationToken" USING btree ("integration_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_key" ON "user" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_stripe_id_key" ON "user" USING btree ("stripe_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_username_key" ON "user" USING btree ("username");