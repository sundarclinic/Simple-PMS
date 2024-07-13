'use client';

import React from 'react';

import { DataTable } from '@/components/ui/data-table';

import { Patient } from '@/db/schemas/patients';
import { paymentColumns } from './columns';
import { Payment } from '@/db/schemas/payments';
import { Invoice } from '@/db/schemas/invoices';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof DataTable>
	> {
	payments: (Payment & { patient: Patient; invoice: Invoice })[] | null;
}

const PaymentsTable: React.FC<Props> = ({ payments }) => {
	return <DataTable columns={paymentColumns} data={payments} />;
};

export default PaymentsTable;
