import InvoicesTable from '@/components/dashboard/invoices-table';
import RecentInvoice from '@/components/dashboard/recent-invoice/index';
import InsightCard from '@/components/dashboard/insight-card';
import NoInvoiceSelected from '@/components/dashboard/no-invoice-selected';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getDashboardInsights } from '@/lib/dashboard/actions';
import { PageParams } from '@/lib/types';
import { Invoice } from '@/db/schemas/invoices';
import { getInvoiceById } from '@/lib/invoices/actions';
import { Patient } from '@/db/schemas/patients';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard',
};

type DashboardPageParams = PageParams & {
	searchParams?: { selectedInvoice?: string };
};

type SelectedInvoice = { invoice: Invoice; patient: Patient } | null;

export default async function Dashboard({ searchParams }: DashboardPageParams) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	const insights = await getDashboardInsights();

	let invoice: SelectedInvoice;
	if (searchParams?.selectedInvoice) {
		invoice = await getInvoiceById(searchParams.selectedInvoice);
	} else {
		invoice = null;
	}

	return (
		<div className='grid items-start gap-4 md:gap-8 lg:grid-cols-3'>
			<div className='lg:col-span-2 w-full flex flex-col gap-4 md:gap-8'>
				<section className='grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4 md:gap-8'>
					<InsightCard
						label='Total Outstanding Dues'
						value={`₹${insights.outstandingDues}`}
						percentage={insights.weekDifference.outstandingDues}
					/>
					<InsightCard
						label='Total Overdue Invoices'
						value={insights.overdueInvoices}
						percentage={insights.weekDifference.overdueInvoices}
					/>
					<InsightCard
						label='Total Payment Received'
						value={`₹${insights.totalPaymentsReceived}`}
						percentage={
							insights.weekDifference.totalPaymentsReceived
						}
					/>
				</section>
				<InvoicesTable />
			</div>
			{invoice ? (
				<RecentInvoice invoice={invoice} />
			) : (
				<NoInvoiceSelected />
			)}
		</div>
	);
}
