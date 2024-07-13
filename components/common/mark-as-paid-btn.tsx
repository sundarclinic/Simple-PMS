import React from 'react';

import { Button } from '../ui/button';
import { ReceiptText } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<'button'>> {}

const MarkInvoiceAsPaidBtn: React.FC<Props> = ({ className, ...props }) => {
	return (
		<Button
			size='sm'
			variant='outline'
			className={cn('h-8 gap-1', className)}
			disabled
		>
			<ReceiptText className='h-3.5 w-3.5' />
			<span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
				Mark as Paid
			</span>
		</Button>
	);
};

export default MarkInvoiceAsPaidBtn;
