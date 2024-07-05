import React from 'react';

import { Separator } from '@/components/ui/separator';
import PatientHeader from '@/components/patients/view/header';
import PatientDetails from '@/components/patients/view/details';
import PatientInvoices from '@/components/common/invoices';
import PatientPayments from '@/components/common/payments';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PageParams } from '@/lib/types';
import { getPatientById } from '@/lib/patients/actions';

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

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<div className='mx-auto grid max-w-2xl flex-1 gap-4 w-full'>
				<PatientHeader patient={patient} />
				<PatientDetails patient={patient} />
				<Separator decorative />
				<PatientInvoices />
				<PatientPayments />
			</div>
		</div>
	);
};

export default ViewIndividualPatient;
