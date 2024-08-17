'use client';

import React from 'react';

import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Copy, Printer, Share } from 'lucide-react';
import TemporaryShare from '@/components/common/temporary-share';

import { Invoice } from '@/db/schemas/invoices';
import { Patient } from '@/db/schemas/patients';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn, currencyFormatter, dateFormatter } from '@/lib/utils';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof DropdownMenu>
	> {
	invoice: { invoice: Invoice; patient: Patient };
	handlePrint: () => void;
}

const Options: React.FC<Props> = ({ invoice, handlePrint }) => {
	const { handleCopyToClipboard } = useCopyToClipboard();
	const pathname = usePathname();

	const text = `${
		invoice.patient.name
	} you have pending payment of ${currencyFormatter(
		invoice.invoice.amount - invoice.invoice.paidAmount
	)} for ${invoice.invoice.title} to Sundar Clinic due on ${dateFormatter(
		new Date(invoice.invoice.dueDate)
	)}. Please make the payment at your earliest convenience. Thank you!`;

	const handleShare = async () => {
		try {
			const shareData = {
				title: 'Invoice Details',
				text,
				// TODO: Add Public URL for the invoice
				// url: window.location.href,
			};
			await navigator.share(shareData);
		} catch (error) {
			toast.error('Failed to share invoice details');
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				className={cn({ hidden: pathname.includes('/t/') })}
			>
				<Button
					size='icon'
					variant='outline'
					className='h-8 w-8 print:hidden'
				>
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
					className={cn('cursor-pointer flex items-center gap-2')}
					onClick={(e) => {
						e.preventDefault();
						handleShare();
					}}
					onSelect={(e) => e.preventDefault()}
				>
					<Share size={16} />
					Share
				</DropdownMenuItem>
				<DropdownMenuItem
					role='button'
					className='cursor-pointer flex items-center gap-2'
					onClick={(e) => {
						e.preventDefault();
						handleCopyToClipboard(text, 'invoice details');
					}}
					onSelect={(e) => e.preventDefault()}
				>
					<Copy size={16} />
					Copy
				</DropdownMenuItem>
				<DropdownMenuItem
					role='button'
					className='cursor-pointer flex items-center gap-2'
					onClick={(e) => {
						e.preventDefault();
						handlePrint();
					}}
					onSelect={(e) => e.preventDefault()}
				>
					<Printer size={16} />
					Print
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={(e) => e.preventDefault()}
					onSelect={(e) => e.preventDefault()}
				>
					<TemporaryShare
						sourceId={invoice.invoice.id}
						content='invoice'
					>
						Share Invoice
					</TemporaryShare>
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
