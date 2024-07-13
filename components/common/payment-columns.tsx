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

import { ColumnDef } from '@tanstack/react-table';
import { dateFormatter } from '@/lib/utils';
import { Invoice } from '@/db/schemas/invoices';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Payment } from '@/db/schemas/payments';

export const paymentColumns: ColumnDef<Payment>[] = [
	{
		accessorKey: 'date',
		header: () => <div className='hidden sm:block'>Payment Date</div>,
		cell: ({ row }) => {
			const { date } = row.original;
			return (
				<div className='hidden sm:block'>
					{date ? dateFormatter(new Date(date)) : null}
				</div>
			);
		},
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
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
						{/* <DropdownMenuItem asChild className='cursor-pointer'>
							<Link
								href={
									isDashboard
										? `/dashboard?selectedInvoice=${id}`
										: `/dashboard/invoices/${id}`
								}
							>
								View
							</Link>
						</DropdownMenuItem> */}
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
