import React from 'react';

import PatientAddForm from '@/components/patients/add-form';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PageParams } from '@/lib/types';

const IndividualPatient = async ({ searchParams }: PageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<PatientAddForm />
		</div>
	);
};

export default IndividualPatient;
