import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { RotateCw } from 'lucide-react';

import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { InsertPayment, Payment } from '@/db/schemas/payments';
import { Patient } from '@/db/schemas/patients';
import { Invoice } from '@/db/schemas/invoices';
import { deletePayment } from '@/lib/payments/actions';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	payment: (Payment & { invoice: Invoice; patient: Patient }) | null;
}

const DeletePayment: React.FC<Props> = ({ payment }) => {
	const router = useRouter();
	const {
		formState: { isSubmitting },
		getValues,
	} = useFormContext<InsertPayment>();
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);
			const { message } = await deletePayment(
				payment?.id,
				getValues('updateInvoices')
			);
			if (message === 'Payment deleted successfully') {
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
		<Card>
			<CardHeader>
				<CardTitle>Delete Payment</CardTitle>
				<CardDescription>
					Deleting a payment will remove all associated data.
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

export default DeletePayment;
