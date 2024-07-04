import {
	pgTable,
	text,
	uuid,
	date,
	integer,
	timestamp,
	AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';
import { patients } from './patients';

export const invoices = pgTable('invoices', {
	id: uuid('id').primaryKey(),
	patientId: uuid('patient_id')
		.notNull()
		.references((): AnyPgColumn => patients.id, { onDelete: 'cascade' }),
	amount: integer('amount').notNull(),
	paidAmount: integer('paid_amount').notNull().default(0),
	dueDate: date('due_date').notNull(),
	notes: text('notes'),
	created_at: timestamp('created_at').defaultNow().notNull(),
	updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const insertInvoice = createInsertSchema(invoices)
	.omit({
		id: true,
		created_at: true,
		updated_at: true,
	})
	.merge(
		z.object({
			id: z.string().uuid(),
			patientId: z
				.string({
					message:
						'Patient is required to be associated with the invoice.',
				})
				.uuid(),
			amount: z.number().min(1),
			paidAmount: z.number().min(0).default(0),
			dueDate: z
				.date()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined) return null;
					return v;
				}),
			notes: z
				.string()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined || v === '') return null;
					return v;
				}),
		})
	);

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoiceToDb = typeof invoices.$inferInsert;
export type InsertInvoice = z.infer<typeof insertInvoice>;
