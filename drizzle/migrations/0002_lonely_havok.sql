ALTER TABLE "variant_products" ALTER COLUMN "price" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "variant_products" ALTER COLUMN "original_price" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "variant_products" DROP COLUMN "stock";