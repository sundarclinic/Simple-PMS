import {
	pgTable,
	text,
	uuid,
	date,
	integer,
	timestamp,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

export const patients = pgTable('paitents', {
	id: uuid('id').primaryKey(),
	name: text('name').notNull(),
	phone: text('phone').notNull(),
	age: integer('age'),
	address: text('address'),
	email: text('email'),
	image: text('image'),
	dob: date('dob'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertPatient = createInsertSchema(patients)
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
	})
	.merge(
		z.object({
			id: z.string(),
			name: z
				.string()
				.min(3, {
					message: 'Name must be at least 3 characters',
				})
				.max(255, {
					message: 'Name must be at most 255 characters',
				}),
			phone: z
				.string()
				.length(10, {
					message: 'Phone number must be 10 digits',
				})
				.regex(/^\d+$/, {
					message: 'Phone number must contain only digits',
				}),
			email: z
				.string()
				.email()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined || v === '') return null;
					return v;
				}),
			age: z
				.number()
				.min(0, {
					message: 'Age must be greater than 0',
				})
				.default(0)
				.nullable()
				.optional(),
			address: z
				.string()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined || v === '') return null;
					return v;
				}),
			image: z
				.string()
				.url()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined || v === '') return null;
					return v;
				}),
			dob: z
				.date()
				.nullable()
				.optional()
				.transform((v) => {
					if (v === undefined) return null;
					return v;
				}),
		})
	);

export type Patient = typeof patients.$inferSelect;
export type InsertPatientToDb = typeof patients.$inferInsert;
export type InsertPatient = z.infer<typeof insertPatient>;
