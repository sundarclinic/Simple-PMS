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
import PaymentInfoDialog from '../payments/payment-info-dialog';

import { ColumnDef } from '@tanstack/react-table';
import { dateFormatter } from '@/lib/utils';
import { currencyFormatter } from '@/lib/utils';
import { Payment } from '@/db/schemas/payments';
import { Invoice } from '@/db/schemas/invoices';
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
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => {
			const { amount } = row.original;
			return currencyFormatter(amount);
		},
	},
	{
		accessorKey: 'invoiceId',
		header: 'Linked Invoice',
		cell: ({ row }) => {
			const { invoiceId } = row.original;
			return invoiceId ? (
				<Link
					href={`/dashboard/invoices/${invoiceId}`}
					className='text-blue-500 hover:underline flex items-center group w-fit'
				>
					<span className='max-w-[8ch] text-ellipsis whitespace-nowrap overflow-hidden block'>
						{invoiceId}
					</span>
					<ExternalLink className='h-4 w-4 inline shrink-0 group-hover:scale-105 transition-all duration-300' />
				</Link>
			) : null;
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { id } = row.original;
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
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
