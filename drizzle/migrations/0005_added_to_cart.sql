CREATE TABLE "added_to_carts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"variant_product_id" uuid,
	"quantity" integer NOT NULL,
	"added_to_checkout" boolean DEFAULT false,
	"is_purchased" boolean DEFAULT false,
	"is_discarded" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "added_to_carts" ADD CONSTRAINT "added_to_carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "added_to_carts" ADD CONSTRAINT "added_to_carts_variant_product_id_variant_products_id_fk" FOREIGN KEY ("variant_product_id") REFERENCES "public"."variant_products"("id") ON DELETE no action ON UPDATE no action;