import React from 'react';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const NewPayment = async () => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}
	return <div>NewPayment</div>;
};

export default NewPayment;
