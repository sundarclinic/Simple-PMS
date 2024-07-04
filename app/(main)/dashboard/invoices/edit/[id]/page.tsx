import React from 'react';

import InvoicesEditForm from '@/components/invoices/edit-form';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getInvoiceById } from '@/lib/invoices/actions';
import { PageParams } from '@/lib/types';

type EditPageParams = PageParams & { params: { id: string } };

const EditInvoice = async ({ params }: EditPageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	if (!params.id) {
		return redirect('/dashboard/invoices');
	}

	const invoice = await getInvoiceById(params?.id);

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<InvoicesEditForm invoice={invoice} />
		</div>
	);
};

export default EditInvoice;
