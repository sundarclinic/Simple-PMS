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
import { relations } from 'drizzle-orm';

import { invoices } from './invoices';
import { patients } from './patients';

export const payments = pgTable('payments', {
	id: uuid('id').primaryKey(),
	invoiceId: uuid('invoice_id').references((): AnyPgColumn => invoices.id, {
		onDelete: 'cascade',
	}),
	patientId: uuid('patient_id')
		.references((): AnyPgColumn => patients.id, { onDelete: 'cascade' })
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
			invoiceId: z
				.string({
					message:
						'Invoice is required to be associated with the payment.',
				})
				.uuid()
				.nullable()
				.optional(),
			date: z.date({ message: 'Date is required for the payment.' }),
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

export type Payment = typeof payments.$inferSelect;
export type InsertPaymentToDb = typeof payments.$inferInsert;
export type InsertPayment = z.infer<typeof insertPayment>;

export const paymentRelations = relations(payments, ({ one }) => ({
	invoice: one(invoices, {
		fields: [payments.invoiceId],
		references: [invoices.id],
	}),
	patient: one(patients, {
		fields: [payments.patientId],
		references: [patients.id],
	}),
}));
