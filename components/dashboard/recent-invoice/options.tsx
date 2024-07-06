'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Copy, CopyCheck } from 'lucide-react';

import { Invoice } from '@/db/schemas/invoices';
import { Patient } from '@/db/schemas/patients';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof DropdownMenu>
	> {
	invoice: { invoice: Invoice; patient: Patient };
}

const Options: React.FC<Props> = ({ invoice }) => {
	const { isCopied, handleCopyToClipboard } = useCopyToClipboard();

	const text = `${invoice.patient.name} you have pending payment of ${
		invoice.invoice.amount - invoice.invoice.paidAmount
	} to Sundar Clinic due on ${
		invoice.invoice.dueDate
	}. Please make the payment at your earliest convenience. Thank you!`;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size='icon' variant='outline' className='h-8 w-8'>
					<MoreVertical className='h-3.5 w-3.5' />
					<span className='sr-only'>More</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem asChild className='cursor-pointer'>
					<Link
						href={`/dashboard/invoices/edit/${invoice.invoice.id}`}
					>
						Edit Invoice
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					role='button'
					className='cursor-pointer flex items-center gap-2'
					onClick={() => handleCopyToClipboard(text)}
				>
					{isCopied ? <CopyCheck size={16} /> : <Copy size={16} />}{' '}
					{isCopied ? 'Copied!' : 'Copy details'}
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild className='cursor-pointer'>
					<Link href={`/dashboard/patients/${invoice.patient.id}`}>
						View Patient
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default Options;
