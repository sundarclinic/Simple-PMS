import React from 'react';

import PatientHeader from '@/components/patients/view/header';
import PatientDetails from '@/components/patients/view/details';
import PatientInvoices from '@/components/common/invoices';
import PatientPayments from '@/components/common/payments';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PageParams } from '@/lib/types';
import { getPatientById } from '@/lib/patients/actions';
import { getPatientInvoices } from '@/lib/invoices/actions';
import { getPatientPayments } from '@/lib/payments/actions';

type ViewPageParams = PageParams & { params: { patientId: string } };

const ViewIndividualPatient = async ({ params }: ViewPageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	if (!params.patientId) {
		return redirect('/dashboard/patients');
	}

	const patient = await getPatientById(params?.patientId);

	if (!patient) {
		return redirect('/dashboard/patients');
	}

	const invoices = await getPatientInvoices(params.patientId);
	const payments = await getPatientPayments(params.patientId);

	return (
		<div className='grid items-start gap-4 md:gap-8 mx-auto lg:grid-cols-2 max-w-7xl'>
			<div className='grid gap-4 w-full h-fit lg:sticky lg:top-[5.5rem]'>
				<PatientHeader patient={patient} />
				<PatientDetails patient={patient} />
			</div>
			<div className='grid gap-4'>
				<PatientInvoices
					invoices={invoices}
					patientId={params.patientId}
				/>
				<PatientPayments
					patientId={params.patientId}
					payments={payments}
				/>
			</div>
		</div>
	);
};

export default ViewIndividualPatient;
