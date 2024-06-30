import React from 'react';

import PatientEditForm from '@/components/patients/edit-form';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PageParams } from '@/lib/types';
import { getPatientById } from '@/lib/patients/actions';
import PatientAddForm from '@/components/patients/add-form';

const IndividualPatient = async ({ searchParams }: PageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	const patient = await getPatientById((searchParams?.id || '').toString());

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<PatientAddForm />
		</div>
	);
};

export default IndividualPatient;
