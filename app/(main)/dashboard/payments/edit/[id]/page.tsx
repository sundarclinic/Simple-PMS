import React from 'react';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PaymentEditForm from '@/components/payments/edit-form';
import { PageParams } from '@/lib/types';
import { getPaymentById } from '@/lib/payments/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Edit Payment',
};

type EditPageParams = PageParams & { params: { id: string } };

const EditPayment = async ({ params }: EditPageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	const payment = await getPaymentById(params?.id);

	if (!payment) {
		return redirect('/dashboard/payments');
	}

	return (
		<div className='grid items-start gap-4 md:gap-8'>
			<PaymentEditForm payment={payment} />
		</div>
	);
};

export default EditPayment;
