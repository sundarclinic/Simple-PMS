'use client';

import React, { useState } from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Copy, Printer, Share } from 'lucide-react';

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

const TempOptions: React.FC<Props> = ({ invoice, handlePrint }) => {
	const { handleCopyToClipboard } = useCopyToClipboard();
	const pathname = usePathname();
	const [sharing, setSharing] = useState(false);

	const text = `${
		invoice.patient.name
	} you have pending payment of ${currencyFormatter(
		invoice.invoice.amount - invoice.invoice.paidAmount
	)} for ${invoice.invoice.title} to Sundar Clinic due on ${dateFormatter(
		new Date(invoice.invoice.dueDate)
	)}. Please make the payment at your earliest convenience. Thank you!`;

	const handleShare = async () => {
		if (!navigator.share) {
			toast.error('Sharing is not supported in your browser');
			return;
		}
		setSharing(true);
		try {
			const shareData = {
				title: 'Invoice Details',
				text,
				url: window.location.href,
			};
			await navigator.share(shareData);
		} catch (error) {
			toast.error('Failed to share invoice details');
		} finally {
			setSharing(false);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				asChild
				className={cn({ hidden: pathname.includes('dashboard') })}
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
				<DropdownMenuItem
					disabled={sharing}
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default TempOptions;
