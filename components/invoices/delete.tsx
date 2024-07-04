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
import { InsertInvoice, Invoice } from '@/db/schemas/invoices';
import { deleteInvoice } from '@/lib/invoices/actions';
import { Patient } from '@/db/schemas/patients';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	invoice: { invoice: Invoice; patient: Patient } | null;
}

const DeleteInvoice: React.FC<Props> = ({ invoice }) => {
	const router = useRouter();
	const {
		formState: { isSubmitting },
	} = useFormContext<InsertInvoice>();
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);
			const { message } = await deleteInvoice(
				invoice?.invoice.id as string
			);
			if (message === 'Invoice deleted successfully') {
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
		<Card>
			<CardHeader>
				<CardTitle>Delete Invoice</CardTitle>
				<CardDescription>
					Deleting a invoice will remove all associated data.
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

export default DeleteInvoice;
