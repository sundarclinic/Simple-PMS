'use server';

import db from '@/db';
import {
	insertPatient,
	Patient,
	patients,
	InsertPatientToDb,
} from '@/db/schemas/patients';
import { eq } from 'drizzle-orm';
import { FormState } from '@/lib/types';

export const getPatientById = async (id: Patient['id']) => {
	try {
		const patient = await db
			.select()
			.from(patients)
			.where(eq(patients.id, id));
		if (patient.length === 0) return null;
		return patient[0];
	} catch (error) {
		return null;
	}
};

export async function addPatient(
	_: FormState,
	data: FormData
): Promise<FormState & { id?: Patient['id'] }> {
	const formData = Object.fromEntries(data);
	const parsed = insertPatient.safeParse(formData);

	if (!parsed.success) {
		const fields: Record<string, string> = {};
		for (const key of Object.keys(formData)) {
			fields[key] = formData[key].toString();
		}
		return {
			message: 'Invalid form data',
			fields,
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}
	const result = await db
		.insert(patients)
		.values(parsed.data as InsertPatientToDb)
		.returning({ insertedId: patients.id });

	if (!result[0]?.insertedId) {
		const fields: Record<string, string> = {};
		for (const key of Object.keys(formData)) {
			fields[key] = formData[key].toString();
		}
		return {
			message: 'Error adding patient',
			fields,
			issues: ['Could not add patient'],
		};
	}

	return {
		message: 'Patient added successfully',
		id: result[0].insertedId,
		fields: {},
	};
}

export function editPatient(id: Patient['id']) {
	async function edit(
		_: FormState,
		data: FormData
	): Promise<FormState & { id?: Patient['id'] }> {
		const formData = Object.fromEntries(data);
		const parsed = insertPatient.safeParse(formData);
		if (!parsed.success) {
			const fields: Record<string, string> = {};
			for (const key of Object.keys(formData)) {
				fields[key] = formData[key].toString();
			}
			return {
				message: 'Invalid form data',
				fields,
				issues: parsed.error.issues.map((issue) => issue.message),
			};
		}
		const result = await db
			.update(patients)
			.set(parsed.data as InsertPatientToDb)
			.where(eq(patients.id, id))
			.returning({ insertedId: patients.id });

		if (!result[0]?.insertedId) {
			const fields: Record<string, string> = {};
			for (const key of Object.keys(formData)) {
				fields[key] = formData[key].toString();
			}
			return {
				message: 'Error editing patient',
				fields,
				issues: ['Could not edit patient'],
			};
		}

		return {
			message: 'Patient edited successfully',
			id: result[0].insertedId,
			fields: {},
		};
	}
	return edit;
}
