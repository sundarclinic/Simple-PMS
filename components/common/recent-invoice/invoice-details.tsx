import React from 'react';

import { Separator } from '@/components/ui/separator';

import { Invoice } from '@/db/schemas/invoices';
import { currencyFormatter } from '@/lib/utils';

interface Props extends React.HTMLAttributes<'div'> {
	invoice: Invoice;
}

const InvoiceDetails: React.FC<Props> = ({ invoice }) => {
	return (
		<div className='grid gap-3'>
			<div className='font-semibold'>Invoice Details</div>
			<ul className='grid gap-3'>
				<li className='flex items-center justify-between'>
					<span className='text-muted-foreground'>Title</span>
					<span>{invoice.title}</span>
				</li>
				<li className='flex items-center justify-between'>
					<span className='text-muted-foreground'>Amount</span>
					<span>{currencyFormatter(invoice.amount)}</span>
				</li>
				<li className='flex items-center justify-between'>
					<span className='text-muted-foreground'>Paid Amount</span>
					<span>{currencyFormatter(invoice.paidAmount)}</span>
				</li>
			</ul>
			<Separator className='my-2' />
			<ul className='grid gap-3'>
				<li className='flex items-center justify-between font-semibold'>
					<span className='text-muted-foreground'>Amount Due</span>
					<span>
						{currencyFormatter(invoice.amount - invoice.paidAmount)}
					</span>
				</li>
			</ul>
		</div>
	);
};

export default InvoiceDetails;
