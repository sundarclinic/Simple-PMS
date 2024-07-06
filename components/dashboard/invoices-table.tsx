import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';

import { invoiceColumns } from '../invoices/columns';
import { getInvoices } from '@/lib/invoices/actions';

const DASBHOARD_INVOICE_PREVIEW_LIMIT = 8;

const InvoicesTable = async () => {
	const invoices = await getInvoices({
		limit: DASBHOARD_INVOICE_PREVIEW_LIMIT,
	});

	return (
		<Card>
			<CardHeader className='px-7'>
				<CardTitle>Invoices</CardTitle>
				<CardDescription>
					Recent invoices and their status from patients. (Showing 8
					latest invoices)
				</CardDescription>
			</CardHeader>
			<CardContent>
				<DataTable columns={invoiceColumns} data={invoices} />
			</CardContent>
		</Card>
	);
};

export default InvoicesTable;
