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

import { Patient } from '@/db/schemas/patients';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof Dialog>
	> {
	patient: Patient;
}

const DeletePaitentDialog: React.FC<Props> = ({
	children,
	patient,
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
						Are you sure you want to delete this patient <br /> (
						<b className='text-base'>{patient.name}</b>)?
					</DialogTitle>
					<DialogDescription>
						Deleteing <b>{patient.name}</b> will remove all of their
						data from the system, including invoices and payments.
						This action cannot be undone.
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

export default DeletePaitentDialog;
