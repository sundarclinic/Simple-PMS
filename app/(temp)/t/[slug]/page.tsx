import NothingFound from '@/components/temp/nothing-found';
import RecentInvoice from '@/components/common/recent-invoice';

import { getTemporaryPageBySlug } from '@/lib/temp/actions';
import { getInvoiceById } from '@/lib/invoices/actions';
import { PageParams } from '@/lib/types';

type ViewPageParams = PageParams & { params: { slug: string } };

export default async function TemporarySharePage({ params }: ViewPageParams) {
	const page = await getTemporaryPageBySlug(params.slug);
	let invoice: Awaited<ReturnType<typeof getInvoiceById>>;

	console.log(page);

	if (page && page?.content === 'invoice') {
		invoice = await getInvoiceById(page.sourceId);
	}

	return (
		<div className='w-full flex flex-col items-center justify-center'>
			{page ? (
				<section className='max-w-4xl mx-auto'>
					{page.content === 'invoice' ? (
						<RecentInvoice invoice={invoice} />
					) : page.content === 'patient' ? (
						<></>
					) : page.content === 'payment' ? (
						<></>
					) : null}
				</section>
			) : (
				<NothingFound />
			)}
		</div>
	);
}
