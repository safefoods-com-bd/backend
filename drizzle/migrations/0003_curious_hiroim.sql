ALTER TABLE "variant_products" ALTER COLUMN "size_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_products" ADD COLUMN "unit_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_products" ADD CONSTRAINT "variant_products_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;