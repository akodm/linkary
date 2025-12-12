ALTER TABLE "link" ADD COLUMN "image_width" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "link" ADD COLUMN "image_height" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "link" ADD COLUMN "image_aspect_ratio" integer DEFAULT 0 NOT NULL;