ALTER TABLE "variant_products" DROP CONSTRAINT "variant_products_size_id_sizes_id_fk";
--> statement-breakpoint
ALTER TABLE "variant_products" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_products" ALTER COLUMN "color_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_products" ALTER COLUMN "unit_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_products" DROP COLUMN "size_id";