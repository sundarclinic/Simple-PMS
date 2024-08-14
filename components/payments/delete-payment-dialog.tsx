import React from 'react';

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

import { Payment } from '@/db/schemas/payments';

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
	return (
		<Dialog {...props}>
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
					<Button variant='destructive' className='md:w-full'>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeletePaymentDialog;
