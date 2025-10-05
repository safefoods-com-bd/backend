ALTER TABLE "products" DROP CONSTRAINT "products_sku_unique";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "sku" DROP NOT NULL;