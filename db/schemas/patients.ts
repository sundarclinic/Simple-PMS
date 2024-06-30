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
			email: z.string().email().optional(),
			age: z
				.number()
				.min(0, {
					message: 'Age must be greater than 0',
				})
				.default(0)
				.optional(),
			address: z.string().optional(),
			image: z.string().url().optional(),
			dob: z.date().optional(),
		})
	);

export type Patient = typeof patients.$inferSelect;
export type InsertPatientToDb = typeof patients.$inferInsert;
export type InsertPatient = z.infer<typeof insertPatient>;
