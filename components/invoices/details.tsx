import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useFormContext } from 'react-hook-form';
import { InsertInvoice } from '@/db/schemas/invoices';

export default function InvoiceDetails() {
	const {
		control,
		register,
		formState: { isSubmitting },
	} = useFormContext<InsertInvoice>();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Invoice Details</CardTitle>
				<CardDescription>
					Enter the amount due and the amount paid for this invoice.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<FormField
						control={control}
						name='amount'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Amount</FormLabel>
								<FormControl>
									<Input
										placeholder='21'
										type='number'
										{...field}
										{...register('amount', {
											valueAsNumber: true,
										})}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='paidAmount'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Paid</FormLabel>
								<FormControl>
									<Input
										placeholder='21'
										type='number'
										{...field}
										{...register('paidAmount', {
											valueAsNumber: true,
										})}
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
