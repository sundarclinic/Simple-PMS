import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Patient, InsertPatient } from '@/db/schemas/patients';
import { deletePatient } from '@/lib/patients/actions';
import { RotateCw } from 'lucide-react';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	patient: Patient | null;
}

const DeletePatient: React.FC<Props> = ({ patient }) => {
	const router = useRouter();
	const {
		formState: { isSubmitting },
	} = useFormContext<InsertPatient>();
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);
			const { message } = await deletePatient(patient?.id as string);
			if (message === 'Patient deleted successfully') {
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
		<Card>
			<CardHeader>
				<CardTitle>Delete Patient</CardTitle>
				<CardDescription>
					Deleting a patient will remove all associated data.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Button
					size='sm'
					variant='destructive'
					disabled={isSubmitting || loading}
					type='button'
					onClick={handleDelete}
				>
					{loading ? (
						<RotateCw size={16} className='animate-spin mr-2' />
					) : null}
					{loading ? 'Deleting...' : 'Delete'}
				</Button>
			</CardContent>
		</Card>
	);
};

export default DeletePatient;
