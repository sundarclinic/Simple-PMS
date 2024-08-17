ALTER TABLE "temporary_pages" DROP CONSTRAINT "temporary_pages_slug_unique";--> statement-breakpoint
ALTER TABLE "temporary_pages" DROP COLUMN IF EXISTS "slug";--> statement-breakpoint
ALTER TABLE "temporary_pages" DROP COLUMN IF EXISTS "title";