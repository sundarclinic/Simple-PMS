'use server';

import db from '@/db';
import { payments, Payment, InsertPayment } from '@/db/schemas/payments';
import { Invoice, invoices } from '@/db/schemas/invoices';
import { eq, DrizzleError } from 'drizzle-orm';
import { ActionResponse } from '../types';
import { revalidatePath } from 'next/cache';
import { addPaymentToDb, updatePaymentToDb } from './utils';
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
			orderBy: (payments, { desc }) => desc(payments.date),
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
		db.transaction(async (trx) => {
			try {
				const balance = invoice.amount - invoice.paidAmount;

				if (balance === 0) {
					return resolve({
						message: 'Invoice is already paid in full',
					});
				}

				const response = await addPaymentToDb(
					{
						id: uuid(),
						amount: balance,
						date: new Date(),
						patientId: invoice.patientId,
						invoiceId: invoice.id,
					},
					trx
				).then(takeUniqueOrThrow);

				if (!response.insertedId) {
					trx.rollback();
					return resolve({
						message: 'Error marking invoice as paid',
					});
				}

				const updatedInvoice = await trx
					.update(invoices)
					.set({
						paidAmount: invoice.amount,
					})
					.where(eq(invoices.id, invoice.id))
					.returning({ updatedId: invoices.id })
					.then(takeUniqueOrThrow);

				if (!updatedInvoice.updatedId) {
					trx.rollback();
					return resolve({
						message: 'Error marking invoice as paid',
					});
				}

				revalidatePath('/dashboard/invoices');
				revalidatePath('/dashboard');
				revalidatePath(`/dashboard/invoices/${invoice.id}`);
				return resolve({
					message: 'Invoice marked as paid successfully',
					id: response.insertedId,
				});
			} catch (error) {
				console.log(error);
				if (error instanceof DrizzleError) {
					reject({ message: error.message });
				} else {
					reject({
						message:
							'Error marking invoice as paid. Please try again.',
					});
				}
			}
		});
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
	id: Payment['id']
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		db.transaction(async (trx) => {
			try {
				const payment = await db.query.payments.findFirst({
					where: (payments, { eq }) => eq(payments.id, id),
					with: {
						invoice: true,
					},
				});

				if (!payment) {
					return resolve({ message: 'Payment not found' });
				}

				if (payment.invoiceId) {
					const updatedInvoice = await trx
						.update(invoices)
						.set({
							paidAmount:
								payment.invoice.paidAmount - payment.amount,
						})
						.where(eq(invoices.id, payment.invoiceId))
						.returning({ updatedId: invoices.id })
						.then(takeUniqueOrThrow);

					if (!updatedInvoice.updatedId) {
						trx.rollback();
						return resolve({ message: 'Error deleting payment' });
					}
				}

				const response = await trx
					.delete(payments)
					.where(eq(payments.id, id))
					.returning({ deletedId: payments.id })
					.then(takeUniqueOrThrow);

				if (!response.deletedId) {
					trx.rollback();
					return resolve({ message: 'Error deleting payment' });
				}

				revalidatePath('/dashboard/payments');
				revalidatePath('/dashboard');
				return resolve({
					message: 'Payment deleted successfully',
					id: response.deletedId,
				});
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
	});
}
