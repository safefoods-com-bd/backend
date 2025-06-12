ALTER TABLE "addresses" ALTER COLUMN "flat_no" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "floor_no" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "state" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "country" SET DEFAULT 'Bangladesh';--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "postal_code" DROP NOT NULL;