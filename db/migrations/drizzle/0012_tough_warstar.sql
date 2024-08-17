ALTER TABLE "temporary_pages" ADD COLUMN "slug" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "temporary_pages" ADD CONSTRAINT "temporary_pages_slug_unique" UNIQUE("slug");