import db from '@/db';
import {
	InsertPayment,
	InsertPaymentToDb,
	payments,
} from '@/db/schemas/payments';
import { eq } from 'drizzle-orm';

export async function addPaymentToDb(data: InsertPayment, trx = db) {
	return await trx
		.insert(payments)
		.values({
			...data,
			date: new Date(data.date).toDateString(),
			createdAt: new Date(),
			updatedAt: new Date(),
		} as InsertPaymentToDb)
		.returning({ insertedId: payments.id });
}

export async function updatePaymentToDb(data: InsertPayment, trx = db) {
	return await trx
		.update(payments)
		.set({
			...data,
			date: new Date(data.date).toDateString(),
			updatedAt: new Date(),
		} as InsertPaymentToDb)
		.where(eq(payments.id, data.id))
		.returning({ insertedId: payments.id });
}
