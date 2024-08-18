import NothingFound from '@/components/temp/nothing-found';
import RecentInvoice from '@/components/common/recent-invoice';

import { getTemporaryPageBySlug } from '@/lib/temp/actions';
import { getInvoiceById } from '@/lib/invoices/actions';
import { PageParams } from '@/lib/types';
import { getPaymentById } from '@/lib/payments/actions';
import { getPatientById } from '@/lib/patients/actions';
import { Metadata } from 'next';

type ViewPageParams = PageParams & { params: { slug: string } };

export async function generateMetadata({
	params,
}: ViewPageParams): Promise<Metadata> {
	const page = await getTemporaryPageBySlug(params.slug);

	if (!page) {
		return {
			title: 'Page Not Found',
		};
	}

	if (page.content === 'invoice') {
		const invoice = await getInvoiceById(page.sourceId);
		if (!invoice) {
			return {
				title: 'Invoice Not Found',
			};
		}
		return {
			title: `${invoice.invoice.title} - Invoice for ${invoice.patient.name}`,
		};
	}

	if (page.content === 'patient') {
		const patient = await getPatientById(page.sourceId);
		if (!patient) {
			return {
				title: 'Patient Not Found',
			};
		}
		return {
			title: `${patient.name} - Patient`,
		};
	}

	if (page.content === 'payment') {
		const payment = await getPaymentById(page.sourceId);
		if (!payment) {
			return {
				title: 'Payment Not Found',
			};
		}
		return {
			title: `Payment for ${payment.invoice.title}`,
		};
	}
}

export default async function TemporarySharePage({ params }: ViewPageParams) {
	const page = await getTemporaryPageBySlug(params.slug);

	let invoice: Awaited<ReturnType<typeof getInvoiceById>>;
	let payment: Awaited<ReturnType<typeof getPaymentById>>;
	let patient: Awaited<ReturnType<typeof getPatientById>>;

	if (page && page?.content === 'invoice') {
		invoice = await getInvoiceById(page.sourceId);
	}

	return (
		<div className='w-full flex flex-col items-center justify-center'>
			{page ? (
				<section className='max-w-4xl mx-auto'>
					{page.content === 'invoice' && invoice ? (
						<RecentInvoice invoice={invoice} />
					) : page.content === 'patient' && patient ? (
						<></>
					) : page.content === 'payment' && payment ? (
						<></>
					) : (
						<NothingFound />
					)}
				</section>
			) : (
				<NothingFound />
			)}
		</div>
	);
}
