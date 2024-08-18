'use client';

import React, { useEffect, useState } from 'react';

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
import {
	createTemporaryPage,
	getTemporaryPageBySourceId,
} from '@/lib/temp/actions';
import { PMS_URL } from '@/lib/config';

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
	const [loading, setLoading] = useState(false);
	const [shareUrl, setShareUrl] = useState<string | null>(null);

	const text = `${
		invoice.patient.name
	} you have pending payment of ${currencyFormatter(
		invoice.invoice.amount - invoice.invoice.paidAmount
	)} for ${invoice.invoice.title} to Sundar Clinic due on ${dateFormatter(
		new Date(invoice.invoice.dueDate)
	)}. Please make the payment at your earliest convenience. Thank you!`;

	const getShareUrl = async () => {
		setLoading(true);
		try {
			const data = await getTemporaryPageBySourceId(invoice.invoice.id);
			if (data !== undefined) {
				const url = `${PMS_URL.toString()}t/${data.slug}`;
				setShareUrl(url);
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const createShareUrl = async () => {
		const data = await createTemporaryPage({
			sourceId: invoice.invoice.id,
			content: 'invoice',
		});
		if (
			data.message === 'Temporary page created successfully' &&
			data.url
		) {
			setShareUrl(data.url);
		}
	};

	const handleShare = async () => {
		setLoading(true);
		try {
			if (!shareUrl) {
				await createShareUrl();
			}
			const shareData = {
				title: 'Invoice Details',
				text,
				url: shareUrl,
			};
			await navigator.share(shareData);
		} catch (error) {
			toast.error('Failed to share invoice details');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getShareUrl();
	}, []);

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
