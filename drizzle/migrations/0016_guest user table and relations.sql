CREATE TABLE "guest_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fullName" varchar(255) NOT NULL,
	"email" varchar(91),
	"phone_number" varchar(15) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "addresses" ADD COLUMN "guest_user_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "guest_user_id" uuid;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_guest_user_id_guest_users_id_fk" FOREIGN KEY ("guest_user_id") REFERENCES "public"."guest_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_guest_user_id_guest_users_id_fk" FOREIGN KEY ("guest_user_id") REFERENCES "public"."guest_users"("id") ON DELETE no action ON UPDATE no action;