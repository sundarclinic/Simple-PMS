import React from 'react';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { DataTable } from '../ui/data-table';

import { Payment } from '@/db/schemas/payments';
import { Patient } from '@/db/schemas/patients';
import { Invoice } from '@/db/schemas/invoices';
import { paymentColumns } from './payment-columns';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	payments: (Payment & { invoice: Invoice; patient: Patient })[];
	patientId: string;
}

const PatientPayments: React.FC<Props> = ({ payments, patientId }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payments</CardTitle>
				<CardDescription>
					View and manage payments for this patient.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<DataTable columns={paymentColumns} data={payments} />
			</CardContent>
			<CardFooter className='justify-center border-t p-4'>
				<Button size='sm' variant='ghost' className='gap-1' asChild>
					<Link
						href={`/dashboard/payments/edit?patientId=${patientId}`}
					>
						<PlusCircle className='h-3.5 w-3.5' />
						Add Payment
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PatientPayments;
