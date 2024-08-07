'use server';

import db from '@/db';
import {
	Invoice,
	invoices,
	InsertInvoice,
	InsertInvoiceToDb,
} from '@/db/schemas/invoices';
import {
	and,
	desc,
	DrizzleError,
	eq,
	getTableColumns,
	gte,
	ilike,
	lte,
	not,
} from 'drizzle-orm';
import { ActionResponse } from '@/lib/types';
import { Patient, patients } from '@/db/schemas/patients';
import { revalidatePath } from 'next/cache';
import { isUserAuthenticated } from '@/utils/supabase/server';

export const getInvoiceById = async (id: Invoice['id']) => {
	try {
		await isUserAuthenticated();
		const result = await db
			.select({
				invoice: invoices,
				patient: patients,
			})
			.from(invoices)
			.where(eq(invoices.id, id))
			.leftJoin(patients, eq(invoices.patientId, patients.id));
		if (result.length === 0) return null;
		return result[0];
	} catch (error) {
		console.log(error);
		return null;
	}
};

type GetInvoiceArgs =
	| {
			limit?: number | undefined;
	  }
	| undefined;

export const getInvoices = async (options?: GetInvoiceArgs) => {
	try {
		await isUserAuthenticated();
		const invoiceColumns = getTableColumns(invoices);
		const allInvoices = await db
			.select({
				patient: patients,
				...invoiceColumns,
			})
			.from(invoices)
			.orderBy(desc(invoices.dueDate))
			.leftJoin(patients, eq(invoices.patientId, patients.id))
			.limit(options?.limit);
		return allInvoices;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getPatientInvoices = async (patientId: string) => {
	try {
		await isUserAuthenticated();
		const invoiceColumns = getTableColumns(invoices);
		const allInvoices = await db
			.select({
				patient: patients,
				...invoiceColumns,
			})
			.from(invoices)
			.where(eq(invoices.patientId, patientId))
			.leftJoin(patients, eq(invoices.patientId, patients.id))
			.orderBy(desc(invoices.dueDate));
		return allInvoices;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const checkIfPatientHasPendingInvoices = async (
	patientId: Patient['id']
) => {
	try {
		await isUserAuthenticated();
		const result = await db
			.select()
			.from(invoices)
			.where(
				and(
					eq(invoices.patientId, patientId),
					not(eq(invoices.paidAmount, invoices.amount))
				)
			);
		return result.length > 0;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const getInvoicesByTitleForPatient = async ({
	title,
	patientId,
}: {
	title: Invoice['title'];
	patientId: Patient['id'];
}) => {
	try {
		await isUserAuthenticated();
		if (!title) return [];
		const results = await db
			.select()
			.from(invoices)
			.where(
				and(
					eq(invoices.patientId, patientId),
					ilike(invoices.title, `%${title}%`),
					not(eq(invoices.paidAmount, invoices.amount))
				)
			)
			.orderBy(desc(invoices.dueDate));
		if (results.length === 0) return null;
		return results;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export async function addInvoice(
	data: InsertInvoice
): Promise<ActionResponse & { id?: Invoice['id'] }> {
	try {
		await isUserAuthenticated();
		const result = await db
			.insert(invoices)
			.values({
				...data,
				dueDate: data.dueDate?.toDateString(),
			} as unknown as InsertInvoiceToDb)
			.returning({ insertedId: invoices.id });
		if (!result[0]?.insertedId) {
			return {
				message: 'Error adding invoice',
			};
		}

		revalidatePath('/dashboard/invoices');
		revalidatePath('/dashboard');
		return {
			message: 'Invoice added successfully',
			id: result[0].insertedId,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof DrizzleError) {
			return { message: error.message };
		} else {
			return { message: 'Error adding invoice. Please try again.' };
		}
	}
}

export async function editInvoice(
	data: InsertInvoice
): Promise<ActionResponse & { id?: Invoice['id'] }> {
	try {
		await isUserAuthenticated();
		const result = await db
			.update(invoices)
			.set({
				...data,
				dueDate: data.dueDate?.toDateString(),
				updatedAt: new Date(),
			} as unknown as InsertInvoiceToDb)
			.where(eq(invoices.id, data.id))
			.returning({ insertedId: invoices.id });
		if (!result[0]?.insertedId) {
			return {
				message: 'Error editing invoice',
			};
		}

		revalidatePath('/dashboard/invoices');
		revalidatePath('/dashboard');
		return {
			message: 'Invoice edited successfully',
			id: result[0].insertedId,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof DrizzleError) {
			return { message: error.message };
		} else {
			return { message: 'Error editing invoice. Please try again.' };
		}
	}
}

export async function deleteInvoice(
	id: Invoice['id']
): Promise<ActionResponse> {
	try {
		await isUserAuthenticated();
		const result = await db
			.delete(invoices)
			.where(eq(invoices.id, id))
			.returning({ id: invoices.id });
		if (result.length === 0) {
			return {
				message: 'Error deleting invoice',
			};
		}

		revalidatePath('/dashboard/invoices');
		revalidatePath('/dashboard');
		return {
			message: 'Invoice deleted successfully',
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return { message: error.message };
		} else {
			return { message: 'Error deleting invoice. Please try again.' };
		}
	}
}
