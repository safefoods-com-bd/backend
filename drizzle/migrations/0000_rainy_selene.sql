CREATE TABLE "media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"alt" varchar(91) NOT NULL,
	"url" text NOT NULL,
	"node_three_contents_id" integer,
	"node_four_contents_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "media_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "node_four_contents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_four_contents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"node_four_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "node_four" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_four_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"slug" varchar(91) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"node_three_id" integer NOT NULL,
	CONSTRAINT "node_four_slug_unique" UNIQUE("slug"),
	CONSTRAINT "node_4_unique_for_node_3" UNIQUE("node_three_id","slug")
);
--> statement-breakpoint
CREATE TABLE "node_one" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_one_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"slug" varchar(91) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "node_one_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "node_three_contents" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_three_contents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"node_three_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "node_three" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_three_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"slug" varchar(91) NOT NULL,
	"from" varchar(91) NOT NULL,
	"to" varchar(91) NOT NULL,
	"parameter" varchar(91) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"node_two_id" integer NOT NULL,
	CONSTRAINT "node_three_slug_unique" UNIQUE("slug"),
	CONSTRAINT "node_3_unique_for_node_2" UNIQUE("node_two_id","slug")
);
--> statement-breakpoint
CREATE TABLE "node_two" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "node_two_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"slug" varchar(91) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"node_one_id" integer NOT NULL,
	CONSTRAINT "node_two_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "parameters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "parameters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(91) NOT NULL,
	"slug" varchar(91) NOT NULL,
	"node_two_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "parameters_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "text_editors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "text_editors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content" text NOT NULL,
	"node_three_contents_id" integer,
	"node_four_contents_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_node_three_contents_id_node_three_contents_id_fk" FOREIGN KEY ("node_three_contents_id") REFERENCES "public"."node_three_contents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_node_four_contents_id_node_four_contents_id_fk" FOREIGN KEY ("node_four_contents_id") REFERENCES "public"."node_four_contents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_four_contents" ADD CONSTRAINT "node_four_contents_node_four_id_node_four_id_fk" FOREIGN KEY ("node_four_id") REFERENCES "public"."node_four"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_four" ADD CONSTRAINT "node_four_node_three_id_node_three_id_fk" FOREIGN KEY ("node_three_id") REFERENCES "public"."node_three"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_three_contents" ADD CONSTRAINT "node_three_contents_node_three_id_node_three_id_fk" FOREIGN KEY ("node_three_id") REFERENCES "public"."node_three"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_three" ADD CONSTRAINT "node_three_node_two_id_node_two_id_fk" FOREIGN KEY ("node_two_id") REFERENCES "public"."node_two"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "node_two" ADD CONSTRAINT "node_two_node_one_id_node_one_id_fk" FOREIGN KEY ("node_one_id") REFERENCES "public"."node_one"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parameters" ADD CONSTRAINT "parameters_node_two_id_node_two_id_fk" FOREIGN KEY ("node_two_id") REFERENCES "public"."node_two"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_editors" ADD CONSTRAINT "text_editors_node_three_contents_id_node_three_contents_id_fk" FOREIGN KEY ("node_three_contents_id") REFERENCES "public"."node_three_contents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_editors" ADD CONSTRAINT "text_editors_node_four_contents_id_node_four_contents_id_fk" FOREIGN KEY ("node_four_contents_id") REFERENCES "public"."node_four_contents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_node4_title" ON "node_four" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_node3_title" ON "node_three" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_node2_title" ON "node_two" USING btree ("title");