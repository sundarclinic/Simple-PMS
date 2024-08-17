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

import { Patient } from '@/db/schemas/patients';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deletePatient } from '@/lib/patients/actions';

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
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleToggleOpen = (value: boolean) => {
		setOpen(value);
	};

	const handleDelete = async () => {
		try {
			setLoading(true);
			const { message } = await deletePatient(patient?.id as string);
			if (message === 'Patient deleted successfully') {
				handleToggleOpen(false);
				toast.success(message);
				router.push('/dashboard/patients');
			} else {
				toast.error(message);
			}
		} catch (error) {
			toast.error('Error deleting patient. Please try again.');
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
						<Button
							variant='secondary'
							className='md:w-full'
							disabled={loading}
						>
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

export default DeletePaitentDialog;
