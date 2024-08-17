DO $$ BEGIN
 CREATE TYPE "public"."content" AS ENUM('invoice', 'payment', 'patient');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temporary_pages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" "content" NOT NULL,
	"source_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "temporary_pages_slug_unique" UNIQUE("slug")
);
