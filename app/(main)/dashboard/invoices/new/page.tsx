import React from 'react';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const NewInvoice = async () => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	return <div>NewInvoice</div>;
};

export default NewInvoice;
