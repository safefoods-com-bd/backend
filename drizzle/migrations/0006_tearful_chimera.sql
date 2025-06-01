ALTER TABLE "units" ALTER COLUMN "base_unit" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "operator" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "operation_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "updated_at" DROP NOT NULL;