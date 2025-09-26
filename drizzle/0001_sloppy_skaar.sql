CREATE TABLE "api" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"usage" integer DEFAULT 0 NOT NULL,
	"limit" integer DEFAULT -1,
	"enterprise" boolean DEFAULT false NOT NULL,
	"initial_date_type" text DEFAULT 'month' NOT NULL,
	"initial_date_value" integer
);
--> statement-breakpoint
CREATE TABLE "link" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"tags" text DEFAULT '[]' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"view" integer DEFAULT 0 NOT NULL,
	"report" integer DEFAULT 0 NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"banned_reason" text DEFAULT '' NOT NULL,
	"banned_at" timestamp with time zone,
	"user_id" integer,
	"link_folder_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "link_folder" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "link_folder_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "link_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"link_id" integer NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "link_safety" (
	"id" serial PRIMARY KEY NOT NULL,
	"safe" boolean DEFAULT false NOT NULL,
	"reason" text DEFAULT '' NOT NULL,
	"user_id" integer,
	"link_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "link_view" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"link_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_api" (
	"id" serial PRIMARY KEY NOT NULL,
	"usage" integer DEFAULT 0 NOT NULL,
	"cumulative_usage" integer DEFAULT 0 NOT NULL,
	"user_id" integer NOT NULL,
	"api_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "slug" text DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider_id" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "locale" text DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "link" ADD CONSTRAINT "link_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link" ADD CONSTRAINT "link_link_folder_id_link_folder_id_fk" FOREIGN KEY ("link_folder_id") REFERENCES "public"."link_folder"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_folder" ADD CONSTRAINT "link_folder_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_report" ADD CONSTRAINT "link_report_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_report" ADD CONSTRAINT "link_report_link_id_link_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."link"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_safety" ADD CONSTRAINT "link_safety_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_safety" ADD CONSTRAINT "link_safety_link_id_link_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."link"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_view" ADD CONSTRAINT "link_view_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "link_view" ADD CONSTRAINT "link_view_link_id_link_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."link"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_api" ADD CONSTRAINT "user_api_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_api" ADD CONSTRAINT "user_api_api_id_api_id_fk" FOREIGN KEY ("api_id") REFERENCES "public"."api"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_slug_unique" UNIQUE("slug");