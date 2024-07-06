'use server';

import db from '@/db';
import {
	Invoice,
	invoices,
	InsertInvoice,
	InsertInvoiceToDb,
} from '@/db/schemas/invoices';
import { desc, DrizzleError, eq, getTableColumns } from 'drizzle-orm';
import { ActionResponse } from '@/lib/types';
import { patients } from '@/db/schemas/patients';

export const getInvoiceById = async (id: Invoice['id']) => {
	try {
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

export async function addInvoice(
	data: InsertInvoice
): Promise<ActionResponse & { id?: Invoice['id'] }> {
	try {
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
		const result = await db
			.delete(invoices)
			.where(eq(invoices.id, id))
			.returning({ id: invoices.id });
		if (result.length === 0) {
			return {
				message: 'Error deleting invoice',
			};
		}

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
