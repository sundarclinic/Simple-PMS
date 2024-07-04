import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useFormContext } from 'react-hook-form';
import { InsertInvoice } from '@/db/schemas/invoices';

export default function InvoiceDueDate() {
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext<InsertInvoice>();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Due Date</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<FormField
						control={control}
						name='dueDate'
						disabled={isSubmitting}
						render={({
							field: { value, onChange, ...fieldProps },
						}) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Date</FormLabel>
								<FormControl>
									<DatePicker
										{...fieldProps}
										date={value}
										onSelect={onChange}
										calendarProps={{
											disabled: (date) =>
												date <
												new Date(
													new Date().setDate(
														new Date().getDate() - 1
													)
												),
										}}
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
