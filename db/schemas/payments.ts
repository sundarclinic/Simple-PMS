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
import { invoices } from './invoices';
import { patients } from './patients';

export const payments = pgTable('payments', {
	id: uuid('id').primaryKey(),
	invoiceId: uuid('invoice_id')
		.references((): AnyPgColumn => invoices.id, {
			onDelete: 'cascade',
		})
		.notNull(),
	amount: integer('amount').notNull(),
	date: date('date').notNull(),
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertPayment = createInsertSchema(payments)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		invoiceId: true,
	})
	.merge(
		z.object({
			id: z.string().uuid(),
			amount: z.number().min(1, {
				message: 'Amount must be greater than 0.',
			}),
			patientId: z
				.string({
					message:
						'Patient is required to be associated with the payment.',
				})
				.uuid(),
			date: z.date({ message: 'Date is required for the payment.' }),
			notes: z
				.string()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined || v === '') return null;
					return v;
				}),
			updateInvoices: z.boolean().default(false),
		})
	);

export type Payment = typeof payments.$inferSelect;
export type InsertPaymentToDb = typeof payments.$inferInsert;
export type InsertPayment = z.infer<typeof insertPayment>;
