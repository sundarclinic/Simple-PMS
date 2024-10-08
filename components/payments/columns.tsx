'use client';

import Link from 'next/link';
import { MoreHorizontal, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PaymentInfoDialog from './payment-info-dialog';
import DeletePaymentDialog from './delete-payment-dialog';

import { ColumnDef } from '@tanstack/react-table';
import { dateFormatter, currencyFormatter } from '@/lib/utils';
import { Invoice } from '@/db/schemas/invoices';
import { Payment } from '@/db/schemas/payments';
import { Patient } from '@/db/schemas/patients';

type PaymentTableProps = Payment & { invoice: Invoice; patient: Patient };

export const paymentColumns: ColumnDef<PaymentTableProps>[] = [
	{
		accessorKey: 'date',
		header: 'Payment Date',
		cell: ({ row }) => {
			const { date } = row.original;
			return (
				<div className=''>
					{date ? dateFormatter(new Date(date)) : null}
				</div>
			);
		},
	},
	{
		accessorKey: 'patient.name',
		header: 'Patient',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => {
			const { amount } = row.original;
			return currencyFormatter(amount);
		},
	},
	{
		accessorKey: 'notes',
		header: () => <div className='sm:max-w-[12rem]'>Notes</div>,
		cell: ({ row }) => {
			const { notes } = row.original;
			return <div className='sm:max-w-[12rem]'>{notes}</div>;
		},
	},
	{
		accessorKey: 'invoiceId',
		header: 'Linked Invoice',
		cell: ({ row }) => {
			const { invoiceId, invoice } = row.original;
			return invoiceId ? (
				<Link
					href={`/dashboard/invoices/${invoiceId}`}
					className='text-blue-500 hover:underline flex items-center group w-fit gap-1'
					title={invoice.title}
				>
					<span className='max-w-[8ch] text-ellipsis whitespace-nowrap overflow-hidden block'>
						{invoice.title}
					</span>
					<ExternalLink className='h-4 w-4 inline shrink-0 group-hover:scale-105 transition-all duration-300' />
				</Link>
			) : null;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { id, patient } = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							aria-haspopup='true'
							size='icon'
							variant='ghost'
						>
							<MoreHorizontal className='h-4 w-4' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							className='cursor-pointer'
							onSelect={(e) => e.preventDefault()}
							onClick={(e) => e.preventDefault()}
						>
							<PaymentInfoDialog payment={row.original} />
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/payments/edit/${id}`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className='m-0'
							onSelect={(e) => e.preventDefault()}
							onClick={(e) => e.preventDefault()}
						>
							<DeletePaymentDialog payment={row.original}>
								Delete
							</DeletePaymentDialog>
						</DropdownMenuItem>
						<DropdownMenuLabel>Related</DropdownMenuLabel>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/patients/${patient.id}`}>
								View Patient
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
