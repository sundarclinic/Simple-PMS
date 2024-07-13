import React from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from '@/components/ui/form';

import { useFormContext } from 'react-hook-form';
import { InsertPayment } from '@/db/schemas/payments';

const UpdatePaymentInvoice = () => {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext<InsertPayment>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Update Payment Invoice</CardTitle>
				<CardDescription>
					Update patient invoices with any increment or decrement in
					payment, or deletion of payment.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormField
					control={control}
					name='updateInvoices'
					render={({ field }) => (
						<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormMessage />
							<div className='space-y-1 leading-none'>
								<FormLabel>
									This will change the invoice paid amount and
									status.
								</FormLabel>
								<FormDescription className='text-xs'>
									Recommened to keep this option checked.
								</FormDescription>
							</div>
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default UpdatePaymentInvoice;
