import { pgTable, text, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { patients } from './patients';
import { invoices } from './invoices';
import { payments } from './payments';

export const contentEnum = pgEnum('content', ['invoice', 'payment', 'patient']);

export const temporaryPages = pgTable('temporary_pages', {
	id: uuid('id').primaryKey(),
	slug: text('slug').unique().notNull(),
	title: text('title').notNull(),
	content: contentEnum('content').notNull(),
	sourceId: uuid('source_id').notNull(),
	expiresAt: timestamp('expires_at')
		.notNull()
		.$defaultFn(() => {
			const now = new Date();
			const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
			return new Date(now.getTime() + ONE_WEEK_IN_MS);
		}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const temporaryPageRelations = relations(temporaryPages, ({ one }) => ({
	patient: one(patients, {
		fields: [temporaryPages.sourceId],
		references: [patients.id],
	}),
	invoice: one(invoices, {
		fields: [temporaryPages.sourceId],
		references: [invoices.id],
	}),
	payment: one(payments, {
		fields: [temporaryPages.sourceId],
		references: [payments.id],
	}),
}));
