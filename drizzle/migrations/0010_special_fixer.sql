CREATE TYPE "providers" AS ENUM (
  'traditional',
  'google',
  'facebook',
  'apple',
  'github',
  'mobile_otp'
);--> statement-breakpoint

ALTER TABLE "users_to_accounts" DROP CONSTRAINT "users_to_accounts_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_accounts" ADD COLUMN "provider_name" "providers" DEFAULT 'traditional' NOT NULL;--> statement-breakpoint
ALTER TABLE "users_to_accounts" DROP COLUMN "account_id";