'use client';

import React, { useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { RotateCw } from 'lucide-react';

import { Invoice } from '@/db/schemas/invoices';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteInvoice } from '@/lib/invoices/actions';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof Dialog>
	> {
	invoice: Invoice;
}

const DeleteInvoiceDialog: React.FC<Props> = ({
	children,
	invoice,
	...props
}) => {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleToggleOpen = (value: boolean) => {
		setOpen(value);
	};

	const handleDelete = async () => {
		try {
			setLoading(true);
			const { message } = await deleteInvoice(invoice?.id as string);
			if (message === 'Invoice deleted successfully') {
				handleToggleOpen(false);
				toast.success(message);
				router.push('/dashboard/invoices');
			} else {
				toast.error(message);
			}
		} catch (error) {
			toast.error('Error deleting invoice. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog {...props} open={open} onOpenChange={handleToggleOpen}>
			<DialogTrigger className='w-full text-left'>
				{children}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Are you sure you want to delete this invoice <br /> (
						<b className='text-base'>{invoice.title}</b>)?
					</DialogTitle>
					<DialogDescription>
						Deleteing <b>{invoice.title}</b> will remove all the
						data related to this invoice from the system, including
						payments. This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='flex items-center gap-4 flex-col md:flex-row'>
					<DialogClose asChild>
						<Button variant='secondary' className='md:w-full'>
							Cancel
						</Button>
					</DialogClose>
					<Button
						size='sm'
						variant='destructive'
						disabled={loading}
						onClick={handleDelete}
						className='md:w-full'
					>
						{loading ? (
							<RotateCw size={16} className='animate-spin mr-2' />
						) : null}
						{loading ? 'Deleting...' : 'Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteInvoiceDialog;
