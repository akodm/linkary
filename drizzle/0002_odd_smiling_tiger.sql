ALTER TABLE "api" ALTER COLUMN "limit" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api" ALTER COLUMN "initial_date_value" SET DEFAULT 1;--> statement-breakpoint
ALTER TABLE "api" ALTER COLUMN "initial_date_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "api" ADD COLUMN "total_limit" integer DEFAULT -1 NOT NULL;--> statement-breakpoint
ALTER TABLE "link" ADD COLUMN "shared" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "link" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "link_folder" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned_reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp with time zone;