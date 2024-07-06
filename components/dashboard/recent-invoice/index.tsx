import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from './header';
import PatientDetails from './patient-details';
import AddressAndNotes from './address-notes';
import InvoiceDetails from './invoice-details';

import { Invoice } from '@/db/schemas/invoices';
import { Patient } from '@/db/schemas/patients';
import { dateFormatter } from '@/lib/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	invoice: { invoice: Invoice; patient: Patient };
}

export default function RecentInvoice({ invoice }: Props) {
	return (
		<Card className='overflow-hidden w-full'>
			<Header invoice={invoice} />
			<CardContent className='p-6 text-sm'>
				<InvoiceDetails invoice={invoice.invoice} />
				<Separator className='my-4' />
				<AddressAndNotes
					address={invoice.patient.address}
					notes={invoice.invoice.notes}
				/>
				<Separator className='my-4' />
				<PatientDetails patient={invoice.patient} />
			</CardContent>
			<CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
				<div className='text-xs text-muted-foreground'>
					Last Updated{' '}
					<time
						dateTime={new Date(
							invoice.invoice.updatedAt
						).toDateString()}
					>
						{dateFormatter(new Date(invoice.invoice.updatedAt))}
					</time>
				</div>
			</CardFooter>
		</Card>
	);
}
