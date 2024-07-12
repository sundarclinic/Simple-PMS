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
import { Invoice } from '@/db/schemas/invoices';
import { DataTable } from '../ui/data-table';

import { invoiceColumns } from './invoice-columns';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	invoices: Invoice[];
	patientId: string;
}

const PatientInvoices: React.FC<Props> = ({ invoices, patientId }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Invoices</CardTitle>
				<CardDescription>
					View and manage invoices for this patient.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<DataTable columns={invoiceColumns} data={invoices} />
			</CardContent>
			<CardFooter className='justify-center border-t p-4'>
				<Button size='sm' variant='ghost' className='gap-1' asChild>
					<Link
						href={`/dashboard/invoices/edit?patientId=${patientId}`}
					>
						<PlusCircle className='h-3.5 w-3.5' />
						Create Invoice
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PatientInvoices;
