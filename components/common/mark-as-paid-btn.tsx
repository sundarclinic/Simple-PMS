'use client';

import React, { useState } from 'react';

import { Button } from '../ui/button';
import { ReceiptText, RotateCw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Invoice } from '@/db/schemas/invoices';
import { getInvoiceStatus } from '@/lib/invoices/utils';
import { toast } from 'sonner';
import { markInvoiceAsPaid } from '@/lib/payments/actions';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithRef<typeof Button>> {
	invoice: Invoice;
}

const MarkInvoiceAsPaidBtn: React.FC<Props> = ({ invoice, className }) => {
	const [loading, setLoading] = useState(false);
	const status = getInvoiceStatus(invoice);

	const handleMarkAsPaid = async () => {
		try {
			setLoading(true);
			const { message } = await markInvoiceAsPaid(invoice);
			if (message === 'Invoice marked as paid') {
				toast.success(message);
			} else {
				toast.error(message);
			}
		} catch (error) {
			toast.error('Error marking invoice as paid. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return status === 'paid' ? null : (
		<Button
			size='sm'
			variant='outline'
			className={cn('h-8 gap-1 print:hidden', className)}
			onClick={handleMarkAsPaid}
			disabled={loading}
		>
			{loading ? (
				<RotateCw className='h-3.5 w-3.5 animate-spin' />
			) : (
				<ReceiptText className='h-3.5 w-3.5' />
			)}
			<span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
				{loading ? 'Updating...' : 'Mark as Paid'}
			</span>
		</Button>
	);
};

export default MarkInvoiceAsPaidBtn;
