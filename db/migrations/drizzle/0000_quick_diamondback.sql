CREATE TABLE IF NOT EXISTS "paitents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"age" integer,
	"address" text,
	"email" text,
	"image" text,
	"dob" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
