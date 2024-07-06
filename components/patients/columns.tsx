'use client';

import Link from 'next/link';
import Image from 'next/image';
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

import { Patient } from '@/db/schemas/patients';
import { dateFormatter } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';

export const patientColums: ColumnDef<Patient>[] = [
	{
		accessorKey: 'image',
		header: () => (
			<div className='hidden sm:table-cell'>
				<span className='sr-only'>Image</span>
			</div>
		),
		cell: ({ row }) => {
			const { image } = row.original;
			return image ? (
				<Image
					alt={row.getValue('name')}
					className='aspect-square rounded-md object-cover hidden sm:table-cell'
					height='64'
					src={image}
					width='64'
					unoptimized
				/>
			) : null;
		},
	},
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
	},
	{
		accessorKey: 'age',
		header: () => <div className='hidden sm:table-cell'>Age</div>,
		cell: ({ row }) => {
			const { age } = row.original;
			return <div className='hidden sm:table-cell'>{age}</div>;
		},
	},
	{
		accessorKey: 'dob',
		header: () => <div className='hidden sm:table-cell'>Date of Birth</div>,
		cell: ({ row }) => {
			const { dob } = row.original;
			return (
				<div className='hidden sm:table-cell'>
					{dob ? dateFormatter(new Date(dob)) : null}
				</div>
			);
		},
	},
	{
		accessorKey: 'address',
		header: () => (
			<div className='hidden sm:max-w-[12rem] sm:table-cell'>Address</div>
		),
		cell: ({ row }) => {
			const { address } = row.original;
			return (
				<div className='sm:max-w-[12rem] hidden sm:table-cell'>
					{address}
				</div>
			);
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
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/patients/${id}`}>View</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className='cursor-pointer'>
							<Link href={`/dashboard/patients/edit/${id}`}>
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
