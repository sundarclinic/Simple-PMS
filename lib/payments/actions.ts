'use server';

import db from '@/db';
import {
	payments,
	Payment,
	InsertPayment,
	InsertPaymentToDb,
} from '@/db/schemas/payments';
import { invoices } from '@/db/schemas/invoices';
import { patients } from '@/db/schemas/patients';
import { eq, getTableColumns, DrizzleError } from 'drizzle-orm';
import { ActionResponse } from '../types';
import { revalidatePath } from 'next/cache';
import {
	addPaymentToDb,
	checkPatientHasUnpaidInvoices,
	decrementInvoicePaymentForPatient,
	incrementInvoicePaymentForPatient,
	updatePaymentToDb,
} from './utils';

export const getPaymentById = async (id: Payment['id']) => {
	try {
		const paymentColumns = getTableColumns(payments);
		const result = await db
			.select({
				invoice: invoices,
				patient: patients,
				...paymentColumns,
			})
			.from(payments)
			.where(eq(payments.id, id))
			.leftJoin(invoices, eq(payments.invoiceId, invoices.id))
			.leftJoin(patients, eq(invoices.patientId, patients.id));
		if (result.length === 0) return null;
		return result[0];
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getPayments = async () => {
	try {
		const paymentColumns = getTableColumns(payments);
		const allPayments = await db
			.select({
				invoice: invoices,
				patient: patients,
				...paymentColumns,
			})
			.from(payments)
			.leftJoin(invoices, eq(payments.invoiceId, invoices.id))
			.leftJoin(patients, eq(invoices.patientId, patients.id));
		return allPayments;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getPatientPayments = async (patientId: string) => {
	try {
		const paymentColumns = getTableColumns(payments);
		const allPayments = await db
			.select({
				invoice: invoices,
				patient: patients,
				...paymentColumns,
			})
			.from(payments)
			.where(eq(invoices.patientId, patientId))
			.leftJoin(invoices, eq(payments.invoiceId, invoices.id))
			.leftJoin(patients, eq(invoices.patientId, patients.id));
		return allPayments;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export async function addPayment(
	data: InsertPayment
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		try {
			if (data.updateInvoices) {
				const unpaidInvoices = await checkPatientHasUnpaidInvoices(
					data.patientId
				);

				if (unpaidInvoices.length === 0) {
					return {
						message: 'No unpaid invoices found for the patient',
					};
				}

				db.transaction(async (trx) => {
					await incrementInvoicePaymentForPatient(
						{
							paymentInfo: data,
							unpaidInvoices,
						},
						trx
					);

					const response = await addPaymentToDb(
						{ data, invoiceId: unpaidInvoices[0].id },
						trx
					);

					if (!response[0]?.insertedId) {
						trx.rollback();
						resolve({
							message: 'Error adding payment. Please try again.',
						});
					}

					revalidatePath('/dashboard/payments');
					revalidatePath('/dashboard');
					resolve({
						message: 'Payment added successfully',
						id: response[0].insertedId,
					});
				});
			} else {
				const response = await addPaymentToDb({ data });
				if (!response[0]?.insertedId) {
					resolve({
						message: 'Error adding payment. Please try again.',
					});
				}
				revalidatePath('/dashboard/payments');
				revalidatePath('/dashboard');
				resolve({
					message: 'Payment added successfully',
					id: response[0].insertedId,
				});
			}
		} catch (error) {
			if (error instanceof DrizzleError) {
				reject({ message: error.message });
			} else {
				reject({ message: 'Error adding payment. Please try again.' });
			}
		}
	});
}

export async function editPayment(
	data: InsertPayment
): Promise<ActionResponse & { id?: Payment['id'] }> {
	return new Promise(async (resolve, reject) => {
		try {
			if (data.updateInvoices) {
				const unpaidInvoices = await checkPatientHasUnpaidInvoices(
					data.patientId
				);

				if (unpaidInvoices.length === 0) {
					resolve({
						message: 'No unpaid invoices found for the patient',
					});
				}

				const previousPayment = await getPaymentById(data.id);

				if (previousPayment.patient.id !== data.id) {
					// Patient Linked has been changed
					db.transaction(async (trx) => {
						await incrementInvoicePaymentForPatient(
							{
								paymentInfo: data,
								unpaidInvoices,
							},
							trx
						);

						const response = await updatePaymentToDb(
							{ data, invoiceId: unpaidInvoices[0].id },
							trx
						);

						if (!response[0]?.insertedId) {
							trx.rollback();
							resolve({
								message:
									'Error editing payment. Please try again.',
							});
						}

						revalidatePath('/dashboard/payments');
						revalidatePath('/dashboard');
						resolve({
							message: 'Payment edited successfully',
							id: response[0].insertedId,
						});
					});
				} else {
					// Patient Remains the same, but he payment amount changes to be recorded
					if (previousPayment.amount < data.amount) {
						// Payment Incremented
						db.transaction(async (trx) => {
							await incrementInvoicePaymentForPatient(
								{
									paymentInfo: data,
									unpaidInvoices,
								},
								trx
							);

							const response = await updatePaymentToDb(
								{ data, invoiceId: unpaidInvoices[0].id },
								trx
							);

							if (!response[0]?.insertedId) {
								trx.rollback();
								resolve({
									message:
										'Error editing payment. Please try again.',
								});
							}

							revalidatePath('/dashboard/payments');
							revalidatePath('/dashboard');
							resolve({
								message: 'Payment edited successfully',
								id: response[0].insertedId,
							});
						});
					} else if (previousPayment.amount > data.amount) {
						// Payment Decremented
						db.transaction(async (trx) => {
							await decrementInvoicePaymentForPatient(
								{
									paymentInfo: data,
									unpaidInvoices,
								},
								trx
							);

							const response = await updatePaymentToDb(
								{ data, invoiceId: unpaidInvoices[0].id },
								trx
							);

							if (!response[0]?.insertedId) {
								trx.rollback();
								resolve({
									message:
										'Error editing payment. Please try again.',
								});
							}

							revalidatePath('/dashboard/payments');
							revalidatePath('/dashboard');
							resolve({
								message: 'Payment edited successfully',
								id: response[0].insertedId,
							});
						});
					} else {
						// No Change in Payment Amount
						const result = await updatePaymentToDb({
							data,
						});

						if (!result[0]?.insertedId) {
							resolve({
								message: 'Error editing payment',
							});
						}

						revalidatePath('/dashboard/payments');
						revalidatePath('/dashboard');
						resolve({
							message: 'Payment edited successfully',
							id: result[0].insertedId,
						});
					}
				}
			} else {
				const result = await updatePaymentToDb({
					data,
				});

				if (!result[0]?.insertedId) {
					resolve({
						message: 'Error editing payment',
					});
				}

				revalidatePath('/dashboard/payments');
				revalidatePath('/dashboard');
				resolve({
					message: 'Payment edited successfully',
					id: result[0].insertedId,
				});
			}
		} catch (error) {
			console.log(error);
			if (error instanceof DrizzleError) {
				reject({ message: error.message });
			} else {
				reject({ message: 'Error editing payment. Please try again.' });
			}
		}
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
				reject({ message: 'Error editing payment. Please try again.' });
			}
		}
	});
}
