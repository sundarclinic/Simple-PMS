import db from '@/db';
import { Invoice, invoices } from '@/db/schemas/invoices';
import {
	InsertPayment,
	InsertPaymentToDb,
	payments,
} from '@/db/schemas/payments';
import { and, desc, eq, lte } from 'drizzle-orm';

type IncrementInvoicePaymentForPatientArgs = {
	unpaidInvoices: Array<Invoice>;
	paymentInfo: InsertPayment;
};

type PaymentToDbArgs = {
	invoiceId?: string | null;
	data: InsertPayment;
};

export async function addPaymentToDb(
	{ invoiceId, data }: PaymentToDbArgs,
	trx = db
) {
	return await trx
		.insert(payments)
		.values({
			...data,
			invoiceId,
			date: new Date(data.date).toDateString(),
		} as InsertPaymentToDb)
		.returning({ insertedId: payments.id });
}

export async function updatePaymentToDb(
	{ data, invoiceId }: PaymentToDbArgs,
	trx = db
) {
	return await trx
		.update(payments)
		.set({
			...data,
			...(invoiceId && { invoiceId }),
			date: new Date(data.date).toDateString(),
			updatedAt: new Date(),
		} as InsertPaymentToDb)
		.where(eq(payments.id, data.id))
		.returning({ insertedId: payments.id });
}

export async function checkPatientHasUnpaidInvoices(patientId: string) {
	const unpaidInvoices = await db
		.select()
		.from(invoices)
		.orderBy(desc(invoices.dueDate))
		.where(
			and(
				eq(invoices.patientId, patientId),
				lte(invoices.paidAmount, invoices.amount)
			)
		);
	return unpaidInvoices;
}

export async function incrementInvoicePaymentForPatient(
	{ paymentInfo, unpaidInvoices }: IncrementInvoicePaymentForPatientArgs,
	trx = db
) {
	let paymentAmount = paymentInfo.amount;
	for (let i = 0; i < unpaidInvoices.length; i++) {
		const invoice = unpaidInvoices[i];
		const remainingAmount = invoice.amount - invoice.paidAmount;
		if (paymentAmount >= remainingAmount) {
			await trx
				.update(invoices)
				.set({
					paidAmount: invoice.amount,
				})
				.where(eq(invoices.id, invoice.id));

			paymentAmount -= remainingAmount;
		} else {
			await trx
				.update(invoices)
				.set({
					paidAmount: invoice.paidAmount + paymentAmount,
				})
				.where(eq(invoices.id, invoice.id));

			paymentAmount = 0;
			break;
		}
	}
}

export async function decrementInvoicePaymentForPatient(
	{ paymentInfo, unpaidInvoices }: IncrementInvoicePaymentForPatientArgs,
	trx = db
) {
	let paymentAmount = paymentInfo.amount;
	for (let i = 0; i < unpaidInvoices.length; i++) {
		const invoice = unpaidInvoices[i];
		const remainingAmount = invoice.amount - invoice.paidAmount;
		if (paymentAmount >= remainingAmount) {
			await trx
				.update(invoices)
				.set({
					paidAmount: 0,
				})
				.where(eq(invoices.id, invoice.id));

			paymentAmount -= remainingAmount;
		} else {
			await trx
				.update(invoices)
				.set({
					paidAmount: invoice.paidAmount - paymentAmount,
				})
				.where(eq(invoices.id, invoice.id));
			paymentAmount = 0;
			break;
		}
	}
}
