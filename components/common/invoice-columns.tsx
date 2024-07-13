'use client';

import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ColumnDef } from '@tanstack/react-table';
import { capitalize, dateFormatter } from '@/lib/utils';
import { Invoice } from '@/db/schemas/invoices';
import { cn, currencyFormatter } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { getInvoiceStatus } from '@/lib/invoices/utils';

export const invoiceColumns: ColumnDef<Invoice>[] = [
	{
		accessorKey: 'createdAt',
		header: () => <div className='hidden sm:block'>Created At</div>,
		cell: ({ row }) => {
			const { createdAt } = row.original;
			return (
				<div className='hidden sm:block'>
					{createdAt ? dateFormatter(new Date(createdAt)) : null}
				</div>
			);
		},
	},
	{
		accessorKey: 'dueDate',
		header: 'Due Date',
		cell: ({ row }) => {
			const { dueDate } = row.original;
			return dueDate ? dateFormatter(new Date(dueDate)) : null;
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
		accessorKey: 'paidAmount',
		header: 'Paid Amount',
		cell: ({ row }) => {
			const { paidAmount } = row.original;
			return currencyFormatter(paidAmount);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = getInvoiceStatus(row.original);
			return (
				<Badge
					variant='outline'
					className={cn('text-white', {
						'bg-red-500': status === 'unpaid',
						'bg-green-500': status === 'paid',
						'bg-orange-500': status === 'partially-paid',
					})}
				>
					{capitalize(status)}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const { id } = row.original;
			const pathname = usePathname();
			const isDashboard = pathname === '/dashboard';
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
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link
								href={
									isDashboard
										? `/dashboard?selectedInvoice=${id}`
										: `/dashboard/invoices/${id}`
								}
							>
								View
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/invoices/edit/${id}`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/payments/edit`}>
								Add Payment
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>Delete</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
