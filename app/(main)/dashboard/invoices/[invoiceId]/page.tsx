import React from 'react';

import PatientHeader from '@/components/patients/view/header';
import PatientDetails from '@/components/patients/view/details';
import RecentInvoice from '@/components/dashboard/recent-invoice';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PageParams } from '@/lib/types';
import { getInvoiceById } from '@/lib/invoices/actions';
import { Metadata } from 'next';

type ViewPageParams = PageParams & { params: { invoiceId: string } };

export async function generateMetadata({
	params,
}: ViewPageParams): Promise<Metadata> {
	const invoice = await getInvoiceById(params.invoiceId);
	if (!invoice) {
		return {
			title: 'Invoice Not Found',
		};
	}
	return {
		title: `${invoice.invoice.title} - Invoice for ${invoice.patient.name}`,
	};
}

const ViewIndividualInvoice = async ({ params }: ViewPageParams) => {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	if (!params.invoiceId) {
		return redirect('/dashboard/invoices');
	}

	const invoice = await getInvoiceById(params.invoiceId);

	if (!invoice) {
		return redirect('/dashboard/invoices');
	}

	return (
		<div className='grid items-start gap-4 md:gap-8 mx-auto lg:grid-cols-2 max-w-7xl'>
			<div className='grid gap-4 w-full h-fit lg:sticky lg:top-[5.5rem] order-2 lg:order-1'>
				<PatientHeader patient={invoice.patient} />
				<PatientDetails patient={invoice.patient} />
			</div>
			<div className='grid gap-4 order-1 lg:order-2'>
				<RecentInvoice invoice={invoice} />
			</div>
		</div>
	);
};

export default ViewIndividualInvoice;
