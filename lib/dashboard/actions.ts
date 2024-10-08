import db from '@/db';
import { invoices } from '@/db/schemas/invoices';
import { payments } from '@/db/schemas/payments';
import { isUserAuthenticated } from '@/utils/supabase/server';
import { sql, lte, and, gte, count, not } from 'drizzle-orm';

export const getDashboardInsights = async () => {
	try {
		await isUserAuthenticated();
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
			.where(
				and(
					lte(invoices.dueDate, new Date().toDateString()),
					gte(
						invoices.dueDate,
						new Date(
							new Date().setDate(new Date().getDate() - 7)
						).toDateString()
					),
					not(gte(invoices.paidAmount, invoices.amount))
				)
			);
		const lastWeekOverdueInvoices = await db
			.select({ total: count() })
			.from(invoices)
			.where(
				and(
					lte(
						invoices.dueDate,
						new Date(
							new Date().setDate(new Date().getDate() - 7)
						).toDateString()
					),
					gte(
						invoices.createdAt,
						new Date(new Date().setDate(new Date().getDate() - 14))
					),
					lte(invoices.createdAt, new Date()),
					not(gte(invoices.paidAmount, invoices.amount))
				)
			);
		const overdueInvoicesDifference =
			(((overdueInvoices[0]?.total || 0) -
				(lastWeekOverdueInvoices[0]?.total || 0)) /
				(lastWeekOverdueInvoices[0]?.total || 1)) *
			100;

		const totalPaymentsReceivedThisWeek = await db
			.select({
				total: sql<number>`SUM(${payments.amount})`,
			})
			.from(payments)
			.where(
				and(
					gte(
						payments.date,
						new Date(
							new Date().setDate(new Date().getDate() - 7)
						).toDateString()
					),
					lte(payments.date, new Date().toDateString())
				)
			);
		const totalPaymentsReceivedLastWeek = await db
			.select({
				total: sql<number>`SUM(${payments.amount})`,
			})
			.from(payments)
			.where(
				and(
					gte(
						payments.date,
						new Date(
							new Date().setDate(new Date().getDate() - 14)
						).toDateString()
					),
					lte(
						payments.date,
						new Date(
							new Date().setDate(new Date().getDate() - 7)
						).toDateString()
					)
				)
			);
		const totalPaymentsReceivedDifference =
			(((totalPaymentsReceivedThisWeek[0]?.total || 0) -
				(totalPaymentsReceivedLastWeek[0]?.total || 0)) /
				(totalPaymentsReceivedLastWeek[0]?.total || 1)) *
			100;

		return {
			outstandingDues: outstandingInvoices[0]?.total || 0,
			overdueInvoices: overdueInvoices[0]?.total || 0,
			totalPaymentsReceived: totalPaymentsReceivedThisWeek[0]?.total || 0,
			weekDifference: {
				outstandingDues: outstandingDuesDifference,
				overdueInvoices: overdueInvoicesDifference,
				totalPaymentsReceived: totalPaymentsReceivedDifference,
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
