ALTER TABLE "payments" ALTER COLUMN "invoice_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "patient_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_patient_id_paitents_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."paitents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
