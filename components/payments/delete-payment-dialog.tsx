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

import { Payment } from '@/db/schemas/payments';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deletePayment } from '@/lib/payments/actions';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof Dialog>
	> {
	payment: Payment;
}

const DeletePaymentDialog: React.FC<Props> = ({
	children,
	payment,
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
			const { message } = await deletePayment(payment?.id as string);
			if (message === 'Payment deleted successfully') {
				handleToggleOpen(false);
				toast.success(message);
				router.push('/dashboard/payments');
			} else {
				toast.error(message);
			}
		} catch (error) {
			toast.error('Error deleting payment. Please try again.');
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
						Are you sure you want to delete this invoice?
					</DialogTitle>
					<DialogDescription>
						Deleteing this payment will remove all the data related
						to this payment from the system. This action cannot be
						undone.
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

export default DeletePaymentDialog;
