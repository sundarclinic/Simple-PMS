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
import RecentInvoice from '@/components/dashboard/recent-invoice';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// if (!user) {
	// 	return redirect('/login');
	// }

	return (
		<div className='grid items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3'>
			<div className='col-span-2 w-full flex flex-col gap-4 md:gap-8'>
				<section className='grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-4 md:gap-8'>
					<Card className='flex flex-col'>
						<CardHeader className='pb-2'>
							<CardDescription>
								Total Outstanding Dues
							</CardDescription>
							<CardTitle className='text-4xl'>₹ 1,329</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-xs text-muted-foreground'>
								+25% from last week
							</div>
						</CardContent>
						<CardFooter className='mt-auto'>
							<Progress value={25} aria-label='25% increase' />
						</CardFooter>
					</Card>
					<Card className='flex flex-col'>
						<CardHeader className='pb-2'>
							<CardDescription>
								Total Overdue Invoices
							</CardDescription>
							<CardTitle className='text-4xl'>20</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='text-xs text-muted-foreground'>
								+5% from last week
							</div>
						</CardContent>
						<CardFooter className='mt-auto'>
							<Progress value={5} aria-label='25% increase' />
						</CardFooter>
					</Card>
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
			<RecentInvoice />
		</div>
	);
}
