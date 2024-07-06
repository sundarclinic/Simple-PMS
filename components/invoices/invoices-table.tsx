import React from 'react';

import { DataTable } from '@/components/ui/data-table';

import { invoiceColumns, InvoicesTableProps } from './columns';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof DataTable>
	> {
	invoices: InvoicesTableProps[];
}

const InvoicesTable: React.FC<Props> = ({ invoices }) => {
	return <DataTable columns={invoiceColumns} data={invoices} />;
};

export default InvoicesTable;
