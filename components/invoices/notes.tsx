import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useFormContext } from 'react-hook-form';
import { InsertInvoice } from '@/db/schemas/invoices';

export default function InvoiceNotes() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext<InsertInvoice>();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Invoice Notes</CardTitle>
				<CardDescription>
					Add any notes or additional information about this invoice.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<FormField
						control={control}
						name='notes'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Notes</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className='min-h-32'
										placeholder='Add notes here'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
