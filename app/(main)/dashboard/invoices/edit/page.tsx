import React from 'react';

import InvoicesAddForm from '@/components/invoices/add-form';

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

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<InvoicesAddForm />
		</div>
	);
};

export default NewInvoice;
