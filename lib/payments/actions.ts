'use server';

import db from '@/db';
import { payments, Payment, InsertPayment } from '@/db/schemas/payments';
import { Invoice, invoices } from '@/db/schemas/invoices';
import { patients } from '@/db/schemas/patients';
import { eq, getTableColumns, DrizzleError, sql, desc } from 'drizzle-orm';
import { ActionResponse } from '../types';
import { revalidatePath } from 'next/cache';
import {
	addPaymentToDb,
	checkPatientHasUnpaidInvoices,
	decrementInvoicePaymentForPatient,
	incrementInvoicePaymentForPatient,
	updatePaymentToDb,
} from './utils';
import { v4 as uuid } from 'uuid';
import { takeUniqueOrThrow } from '@/db/utils';

export const getPaymentById = async (id: Payment['id']) => {
	try {
		const payment = await db.query.payments.findFirst({
			where: (payments, { eq }) => eq(payments.id, id),
			with: {
				invoice: true,
				patient: true,
			},
		});
		return payment;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getPayments = async () => {
	try {
		const allPayments = await db.query.payments.findMany({
			with: {
				invoice: true,
				patient: true,
			},
			orderBy: (payments, { desc }) => desc(payments.date),
		});
		return allPayments;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getPatientPayments = async (patientId: string) => {
	try {
		const allPayments = await db.query.payments.findMany({
			where: (payments, { eq }) => eq(payments.patientId, patientId),
			with: {
				invoice: true,
				patient: true,
			},
		});
		return allPayments;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export async function markInvoiceAsPaid(
	invoice: Invoice
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		console.log(invoice);
		try {
			db.transaction(async (trx) => {
				const response = await trx
					.update(invoices)
					.set({
						paidAmount:
							invoice.paidAmount +
							(invoice.amount - invoice.paidAmount),
						updatedAt: new Date(),
					})
					.where(eq(invoices.id, invoice.id))
					.returning({ updatedId: invoices.id });
				if (!response[0].updatedId) {
					resolve({ message: 'Error marking invoice as paid' });
				}

				const payment = await addPaymentToDb(
					{
						data: {
							id: uuid(),
							amount: invoice.amount - invoice.paidAmount,
							date: new Date(),
							patientId: invoice.patientId,
							notes: 'Invoice Payment',
							updateInvoices: false,
						},
						invoiceId: invoice.id,
					},
					trx
				);

				if (!payment[0]?.insertedId) {
					resolve({ message: 'Error marking invoice as paid' });
				}
				revalidatePath('/dashboard/invoices');
				revalidatePath('/dashboard');
				revalidatePath('/dashboard/invoices/[id]', 'page');
				resolve({ message: 'Invoice marked as paid' });
			});
		} catch (error) {
			console.log(error);
			if (error instanceof DrizzleError) {
				reject({ message: error.message });
			} else {
				reject({
					message: 'Error marking invoice as paid. Please try again.',
				});
			}
		}
	});
}

export async function addPayment(
	data: InsertPayment
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		db.transaction(async (trx) => {
			try {
				if (data.invoiceId) {
					const invoice = await db
						.select()
						.from(invoices)
						.where(eq(invoices.id, data.invoiceId))
						.then(takeUniqueOrThrow);

					const balance = invoice.amount - invoice.paidAmount;

					if (data.amount > balance) {
						return resolve({
							message: `Amount exceeds the balance of the invoice. Balance: ${balance}`,
						});
					}

					const updatedInvoice = await trx
						.update(invoices)
						.set({
							paidAmount: invoice.paidAmount + data.amount,
						})
						.where(eq(invoices.id, data.invoiceId))
						.returning({ updatedId: invoices.id })
						.then(takeUniqueOrThrow);

					if (!updatedInvoice.updatedId) {
						trx.rollback();
						return resolve({
							message: 'Error adding payment. Please try again.',
						});
					}
				}

				const response = await addPaymentToDb(data, trx).then(
					takeUniqueOrThrow
				);

				if (!response.insertedId) {
					trx.rollback();
					return resolve({
						message: 'Error adding payment. Please try again.',
					});
				}

				revalidatePath('/dashboard/payments');
				revalidatePath('/dashboard');
				return resolve({
					message: 'Payment added successfully',
					id: response.insertedId,
				});
			} catch (error) {
				if (error instanceof DrizzleError) {
					reject({ message: error.message });
				} else {
					reject({
						message: 'Error adding payment. Please try again.',
					});
				}
			}
		});
	});
}

export async function editPayment(
	data: InsertPayment
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		db.transaction(async (trx) => {
			try {
				const previousPayment = await db.query.payments.findFirst({
					where: (payments, { eq }) => eq(payments.id, data.id),
					with: {
						invoice: true,
					},
				});

				if (!previousPayment) {
					return resolve({ message: 'Payment not found' });
				}

				if (previousPayment.invoiceId !== data.invoiceId) {
					return resolve({
						message:
							'Linked invoice to the payment cannot be changed',
					});
				}

				if (previousPayment.patientId !== data.patientId) {
					return resolve({
						message:
							'Linked patient to the payment cannot be changed',
					});
				}

				if (previousPayment.invoiceId === null) {
					const response = await updatePaymentToDb(data, trx).then(
						takeUniqueOrThrow
					);

					if (!response.insertedId) {
						trx.rollback();
						return resolve({
							message: 'Error editing payment. Please try again.',
						});
					}

					revalidatePath('/dashboard/payments');
					revalidatePath('/dashboard');
					resolve({
						message: 'Payment edited successfully',
						id: response.insertedId,
					});
				} else {
					const balance =
						previousPayment.invoice.amount -
						previousPayment.invoice.paidAmount;

					if (balance === 0) {
						return resolve({
							message: 'Payment is already paid in full',
						});
					}

					if (data.amount > balance) {
						return resolve({
							message: `Amount exceeds the balance of the invoice. Balance: ${balance}`,
						});
					}

					const updatedInvoice = await trx
						.update(invoices)
						.set({
							paidAmount: data.amount,
						})
						.where(eq(invoices.id, data.invoiceId))
						.returning({ updatedId: invoices.id })
						.then(takeUniqueOrThrow);

					if (!updatedInvoice.updatedId) {
						trx.rollback();
						return resolve({
							message: 'Error editing payment. Please try again.',
						});
					}

					const response = await updatePaymentToDb(data, trx).then(
						takeUniqueOrThrow
					);

					if (!response.insertedId) {
						trx.rollback();
						return resolve({
							message: 'Error editing payment. Please try again.',
						});
					}

					revalidatePath('/dashboard/payments');
					revalidatePath('/dashboard');
					return resolve({
						message: 'Payment edited successfully',
						id: response.insertedId,
					});
				}
			} catch (error) {
				console.log(error);
				if (error instanceof DrizzleError) {
					reject({ message: error.message });
				} else {
					reject({
						message: 'Error editing payment. Please try again.',
					});
				}
			}
		});
	});
}

export async function deletePayment(
	id: Payment['id'],
	updateInvoices: boolean
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		try {
			if (updateInvoices) {
				const payment = await getPaymentById(id);
				if (!payment) return { message: 'Payment not found' };

				db.transaction(async (trx) => {
					const unpaidInvoices = await checkPatientHasUnpaidInvoices(
						payment.patient.id
					);

					await decrementInvoicePaymentForPatient(
						{
							paymentInfo: payment as unknown as InsertPayment,
							unpaidInvoices,
						},
						trx
					);

					const response = await db
						.delete(payments)
						.where(eq(payments.id, id))
						.returning({ deletedId: payments.id });
					if (!response[0]?.deletedId) {
						resolve({
							message:
								'Error deleting payment. Please try again.',
						});
					}
					revalidatePath('/dashboard/payments');
					revalidatePath('/dashboard');
					resolve({
						message: 'Payment deleted successfully',
						id: response[0].deletedId,
					});
				});

				return { message: 'Payment deleted successfully' };
			} else {
				const response = await db
					.delete(payments)
					.where(eq(payments.id, id))
					.returning({ deletedId: payments.id });
				if (!response[0]?.deletedId) {
					resolve({
						message: 'Error deleting payment. Please try again.',
					});
				}
				revalidatePath('/dashboard/payments');
				revalidatePath('/dashboard');
				resolve({
					message: 'Payment deleted successfully',
					id: response[0].deletedId,
				});
			}
		} catch (error) {
			console.log(error);
			if (error instanceof DrizzleError) {
				reject({ message: error.message });
			} else {
				reject({
					message: 'Error deleting payment. Please try again.',
				});
			}
		}
	});
}
