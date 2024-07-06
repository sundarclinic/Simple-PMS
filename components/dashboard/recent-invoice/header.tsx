import React from 'react';

import { Copy, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Options from './options';

import { Invoice } from '@/db/schemas/invoices';
import { Patient } from '@/db/schemas/patients';
import { dateFormatter } from '@/lib/utils';
import CopyInvoiceIdBtn from './copy-invoice-id-btn';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	invoice: { invoice: Invoice; patient: Patient };
}

const Header: React.FC<Props> = ({ invoice }) => {
	return (
		<CardHeader className='bg-muted/50'>
			<div className='flex flex-row items-start gap-2'>
				<section className='grid gap-0.5'>
					<CardTitle className='group flex flex-col text-lg'>
						<span>Invoice</span>
						<div className='flex gap-2 items-center'>
							<span className='text-xs font-normal'>
								{invoice.invoice.id}
							</span>
							<CopyInvoiceIdBtn invoiceId={invoice.invoice.id} />
						</div>
					</CardTitle>
				</section>
				<section className='ml-auto flex items-center gap-1'>
					<Button size='sm' variant='outline' className='h-8 gap-1'>
						<ReceiptText className='h-3.5 w-3.5' />
						<span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
							Mark as Paid
						</span>
					</Button>
					<Options invoice={invoice} />
				</section>
			</div>
			<CardDescription className='mt-2'>
				<span>
					Created At:{' '}
					<time
						dateTime={new Date(
							invoice.invoice.createdAt
						).toDateString()}
					>
						{dateFormatter(new Date(invoice.invoice.createdAt))}
					</time>
					,{' '}
				</span>
				<span>
					Due Date:{' '}
					<time
						dateTime={new Date(
							invoice.invoice.dueDate
						).toDateString()}
					>
						{dateFormatter(new Date(invoice.invoice.dueDate))}
					</time>
				</span>
			</CardDescription>
		</CardHeader>
	);
};

export default Header;
