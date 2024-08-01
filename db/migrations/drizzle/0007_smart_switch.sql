ALTER TABLE "payments" DROP CONSTRAINT "payments_patient_id_paitents_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "invoice_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN IF EXISTS "patient_id";