import db from '@/db';
import { Patient, patients } from '@/db/schemas/patients';
import { eq } from 'drizzle-orm';

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
