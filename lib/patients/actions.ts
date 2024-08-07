'use server';

import db from '@/db';
import {
	Patient,
	patients,
	InsertPatient,
	InsertPatientToDb,
} from '@/db/schemas/patients';
import { DrizzleError, eq, desc, ilike, or } from 'drizzle-orm';
import { ActionResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { isUserAuthenticated } from '@/utils/supabase/server';

export const getPatientById = async (id: Patient['id']) => {
	try {
		await isUserAuthenticated();
		const patient = await db
			.select()
			.from(patients)
			.where(eq(patients.id, id));
		if (patient.length === 0) return null;
		return patient[0];
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getPatients = async () => {
	try {
		await isUserAuthenticated();
		const allPatients = await db
			.select()
			.from(patients)
			.orderBy(desc(patients.createdAt));
		return allPatients;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getPatientsByName = async (name: Patient['name']) => {
	try {
		await isUserAuthenticated();
		if (!name) return [];
		const results = await db
			.select()
			.from(patients)
			.where(
				or(
					ilike(patients.name, `%${name}%`),
					ilike(patients.phone, `%${name}%`)
				)
			);
		if (results.length === 0) return null;
		return results;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export async function addPatient(
	data: InsertPatient
): Promise<ActionResponse & { id?: Patient['id'] }> {
	try {
		await isUserAuthenticated();
		const result = await db
			.insert(patients)
			.values({
				...data,
				...(data?.dob && { dob: data?.dob?.toDateString() }),
			} as unknown as InsertPatientToDb)
			.returning({ insertedId: patients.id });
		if (!result[0]?.insertedId) {
			return {
				message: 'Error adding patient',
			};
		}

		revalidatePath('/dashboard/patients');
		revalidatePath('/dashboard');
		return {
			message: 'Patient added successfully',
			id: result[0].insertedId,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof DrizzleError) {
			return { message: error.message };
		} else if (error instanceof Error && error.name === 'PostgresError') {
			if (
				(error as Error & { constraint_name: string })
					.constraint_name === 'paitents_phone_unique'
			) {
				return { message: 'Phone number already exists' };
			} else {
				return {
					message: 'Error adding patient. Please try again.',
				};
			}
		} else {
			return {
				message: 'Error adding patient. Please try again.',
			};
		}
	}
}

export async function editPatient(
	data: InsertPatient
): Promise<ActionResponse & { id?: Patient['id'] }> {
	try {
		await isUserAuthenticated();
		const result = await db
			.update(patients)
			.set({
				...data,
				...(data?.dob && { dob: data?.dob?.toDateString() }),
				updatedAt: new Date(),
			} as unknown as InsertPatientToDb)
			.where(eq(patients.id, data.id))
			.returning({ insertedId: patients.id });
		if (!result[0]?.insertedId) {
			return {
				message: 'Error editing patient',
			};
		}

		revalidatePath('/dashboard/patients');
		revalidatePath('/dashboard');
		return {
			message: 'Patient edited successfully',
			id: result[0].insertedId,
		};
	} catch (error) {
		console.log(error);
		if (error instanceof DrizzleError) {
			return { message: error.message };
		} else {
			return {
				message: 'Error editing patient. Please try again.',
			};
		}
	}
}

export async function deletePatient(
	id: Patient['id']
): Promise<ActionResponse> {
	try {
		await isUserAuthenticated();
		const result = await db
			.delete(patients)
			.where(eq(patients.id, id))
			.returning({ id: patients.id });
		if (result.length === 0) {
			return {
				message: 'Error deleting patient',
			};
		}

		revalidatePath('/dashboard/patients');
		revalidatePath('/dashboard');
		return {
			message: 'Patient deleted successfully',
		};
	} catch (error) {
		if (error instanceof DrizzleError) {
			return { message: error.message };
		} else {
			return {
				message: 'Error deleting patient. Please try again.',
			};
		}
	}
}
