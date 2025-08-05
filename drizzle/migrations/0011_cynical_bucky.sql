ALTER TABLE "profiles" ADD COLUMN "full_name" varchar(100);--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "firstName";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "lastName";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "phone_number";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "emergency_contact";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "timezone";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "language";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "job_title";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "department";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "2fa_enabled";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "notification_prefs";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "is_active";