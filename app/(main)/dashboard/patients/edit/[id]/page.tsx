import React from 'react';

import PatientEditForm from '@/components/patients/edit-form';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PageParams } from '@/lib/types';
import { getPatientById } from '@/lib/patients/actions';
import { Metadata } from 'next';
import { checkIfPatientHasPendingInvoices } from '@/lib/invoices/actions';

export const metadata: Metadata = {
	title: 'Edit Patient',
};

type EditPageParams = PageParams & { params: { id: string } };

const IndividualPatient = async ({ params }: EditPageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	if (!params.id) {
		return redirect('/dashboard/patients');
	}

	const patient = await getPatientById(params?.id);

	if (!patient) {
		return redirect('/dashboard/patients');
	}

	const patientHasDues = await checkIfPatientHasPendingInvoices(patient.id);

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<PatientEditForm
				patient={patient}
				patientHasDues={patientHasDues}
			/>
		</div>
	);
};

export default IndividualPatient;
