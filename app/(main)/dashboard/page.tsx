import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
						value={`₹ ${insights.outstandingDues}`}
						percentage={insights.weekDifference.outstandingDues}
					/>
					<InsightCard
						label='Total Overdue Invoices'
						value={insights.overdueInvoices}
						percentage={insights.weekDifference.overdueInvoices}
					/>
					<Card className='flex flex-col'>
						<CardHeader className='pb-2'>
							<CardDescription>
								Total Payment Received
							</CardDescription>
							<CardTitle className='text-4xl'>₹ 25,000</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-xs text-muted-foreground'>
								+27% from last week
							</div>
						</CardContent>
						<CardFooter className='mt-auto'>
							<Progress value={27} aria-label='25% increase' />
						</CardFooter>
					</Card>
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
