import { Invoice } from '@/db/schemas/invoices';

export function getInvoiceStatus({ paidAmount, amount }: Invoice) {
	const status =
		paidAmount === 0
			? 'unpaid'
			: paidAmount >= amount
			? 'paid'
			: 'partially-paid';
	return status;
}
