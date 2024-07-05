'use client';

import React from 'react';

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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
} from '@tanstack/react-table';
import { Patient } from '@/db/schemas/patients';
import { capitalize, dateFormatter } from '@/lib/utils';
import { Invoice } from '@/db/schemas/invoices';
import { cn } from '@/lib/utils';

type InvoicesTableProps = Invoice & { patient: Patient };

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Table>> {
	invoices: InvoicesTableProps[];
}

const columns: ColumnDef<InvoicesTableProps>[] = [
	{
		accessorKey: 'patient.name',
		header: 'Name',
	},
	{
		accessorKey: 'patient.phone',
		header: 'Phone',
	},
	{
		accessorKey: 'createdAt',
		header: () => <div className='hidden sm:table-cell'>Created At</div>,
		cell: ({ row }) => {
			const { createdAt } = row.original;
			return (
				<div className='hidden sm:table-cell'>
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
	},
	{
		accessorKey: 'paidAmount',
		header: 'Paid Amount',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const { amount, paidAmount } = row.original;
			const status =
				paidAmount === 0
					? 'unpaid'
					: paidAmount >= amount
					? 'paid'
					: 'partially-paid';
			return (
				<Badge
					variant='outline'
					className={cn({
						'bg-primary text-primary-foreground':
							status === 'unpaid',
						'bg-success text-success-foreground': status === 'paid',
						'bg-warning text-warning-foreground':
							status === 'partially-paid',
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
			const { id, patientId } = row.original;
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
							<Link href={`/dashboard/invoices/edit/${id}`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/payments/edit`}>
								Add Payment
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link
								href={`/dashboard/patients/edit/${patientId}`}
							>
								View Patient
							</Link>
						</DropdownMenuItem>
						{/* <DropdownMenuItem>Delete</DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const InvoicesTable: React.FC<Props> = ({ invoices }) => {
	const table = useReactTable({
		data: invoices,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className='p-1'>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className='h-24 text-center'
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</>
	);
};

export default InvoicesTable;
