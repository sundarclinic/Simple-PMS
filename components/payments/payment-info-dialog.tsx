'use client';

import React, { useRef } from 'react';

import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Pen, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { Patient } from '@/db/schemas/patients';
import { Invoice } from '@/db/schemas/invoices';
import { Payment } from '@/db/schemas/payments';
import { currencyFormatter, dateFormatter } from '@/lib/utils';
import { useReactToPrint } from 'react-to-print';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof Dialog>
	> {
	payment: Payment & { invoice?: Invoice | undefined; patient: Patient };
}

const PaymentInfoDialog: React.FC<Props> = ({ payment }) => {
	const componentRef = useRef(null);
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
		documentTitle: `Payment ${payment.id} for ${
			payment.invoice ? `Invoice ${payment.invoice.id} - ` : ' '
		}${payment.patient.name} - Sundar Clinic`,
		removeAfterPrint: true,
	});
	return (
		<Dialog>
			<DialogTrigger className='w-full text-left'>Details</DialogTrigger>
			<DialogContent ref={componentRef}>
				<DialogHeader>
					<DialogTitle>
						<p>Payment made by {payment.patient.name}</p>
						<span className='text-xs font-normal'>
							{payment.id}
						</span>
					</DialogTitle>
					<DialogDescription>
						Payment of {currencyFormatter(payment.amount)} made on{' '}
						{dateFormatter(new Date(payment.date))} for{' '}
						{payment.invoiceId ? (
							<Link
								href={`/dashboard/invoices/${payment.invoiceId}`}
								target='_blank'
								className='text-blue-500 hover:underline text-sm'
							>
								{payment.invoice.title}
							</Link>
						) : (
							<span>No invoice linked</span>
						)}
						.
					</DialogDescription>
				</DialogHeader>
				<div>
					<section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<p className='text-sm text-muted-foreground'>
								Payment Date
							</p>
							<p>{dateFormatter(new Date(payment.date))}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>
								Amount
							</p>
							<p>{currencyFormatter(payment.amount)}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>
								Notes
							</p>
							<p>{payment.notes}</p>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>
								Last Updated
							</p>
							<p>{dateFormatter(new Date(payment.updatedAt))}</p>
						</div>
					</section>
					<Separator className='my-4' />
					<section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<p className='text-sm text-muted-foreground'>
								Patient Phone
							</p>
							<Link
								href={`tel:${payment.patient.phone}`}
								className='text-blue-500 hover:underline'
							>
								{payment.patient.phone}
							</Link>
						</div>
						<div>
							<p className='text-sm text-muted-foreground'>
								Patient Email
							</p>
							{payment.patient.email ? (
								<Link
									href={`mailto:${payment.patient.email}`}
									className='text-blue-500 hover:underline'
								>
									{payment.patient.email}
								</Link>
							) : null}
						</div>
					</section>
				</div>
				<DialogFooter className='print:hidden'>
					<DialogClose asChild>
						<Button variant='ghost'>Close</Button>
					</DialogClose>
					<div className='flex items-center gap-2'>
						<Button
							size='icon'
							variant='outline'
							className=''
							asChild
						>
							<Link
								href={`/dashboard/payments/edit/${payment.id}`}
							>
								<Pen size={16} />
							</Link>
						</Button>
						<Button
							size='icon'
							variant='outline'
							onClick={handlePrint}
						>
							<Printer size={16} />
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default PaymentInfoDialog;
