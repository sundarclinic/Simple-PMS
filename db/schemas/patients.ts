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

export const insertPatient = createInsertSchema(patients, {
	email: (schema) => schema.email.email().nullable(),
	age: (schema) => schema.age.int().min(1).default(0),
	address: (schema) => schema.address.nullable(),
	image: (schema) => schema.image.nullable(),
	dob: (schema) => schema.dob.date().nullable(),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatient>;
