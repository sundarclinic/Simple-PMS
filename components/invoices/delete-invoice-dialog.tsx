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

import { Invoice } from '@/db/schemas/invoices';

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
	return (
		<Dialog {...props}>
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
					<Button variant='destructive' className='md:w-full'>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeleteInvoiceDialog;
