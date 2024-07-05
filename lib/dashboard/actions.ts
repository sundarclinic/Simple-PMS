import db from '@/db';
import { invoices } from '@/db/schemas/invoices';
import { sql, lte, and, gte, count } from 'drizzle-orm';

export const getDashboardInsights = async () => {
	try {
		const outstandingInvoices = await db
			.select({
				total: sql<number>`SUM(${invoices.amount}) - SUM(${invoices.paidAmount})`,
			})
			.from(invoices)
			.where(lte(invoices.paidAmount, invoices.amount));
		const lastWeekOutstandingInvoices = await db
			.select({
				total: sql<number>`SUM(${invoices.amount}) - SUM(${invoices.paidAmount})`,
			})
			.from(invoices)
			.where(
				and(
					lte(invoices.paidAmount, invoices.amount),
					and(
						gte(
							invoices.createdAt,
							new Date(
								new Date().setDate(new Date().getDate() - 7)
							)
						),
						lte(invoices.createdAt, new Date())
					)
				)
			);
		const outstandingDuesDifference =
			(((outstandingInvoices[0]?.total || 0) -
				(lastWeekOutstandingInvoices[0]?.total || 0)) /
				(lastWeekOutstandingInvoices[0]?.total || 1)) *
			100;

		const overdueInvoices = await db
			.select({ total: count() })
			.from(invoices)
			.where(lte(invoices.dueDate, new Date().toDateString()));
		const lastWeekOverdueInvoices = await db
			.select({ total: count() })
			.from(invoices)
			.where(
				and(
					lte(invoices.dueDate, new Date().toDateString()),
					and(
						gte(
							invoices.createdAt,
							new Date(
								new Date().setDate(new Date().getDate() - 7)
							)
						),
						lte(invoices.createdAt, new Date())
					)
				)
			);
		const overdueInvoicesDifference =
			(((overdueInvoices[0]?.total || 0) -
				(lastWeekOverdueInvoices[0]?.total || 0)) /
				(lastWeekOverdueInvoices[0]?.total || 1)) *
			100;

		return {
			outstandingDues: outstandingInvoices[0]?.total || 0,
			overdueInvoices: overdueInvoices[0]?.total || 0,
			weekDifference: {
				outstandingDues: outstandingDuesDifference,
				overdueInvoices: overdueInvoicesDifference,
			},
		};
	} catch (error) {
		return {
			outstandingDues: 0,
			overdueInvoices: 0,
			weekDifference: {
				outstandingDues: 0,
				overdueInvoices: 0,
			},
		};
	}
};
