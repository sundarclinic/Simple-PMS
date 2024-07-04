ALTER TABLE "invoices" DROP CONSTRAINT "invoices_patient_id_paitents_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_patient_id_paitents_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."paitents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
