import React from 'react';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const EditPayment = async () => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}
	return <div className='grid items-start gap-4 md:gap-8'>EditPayment</div>;
};

export default EditPayment;
