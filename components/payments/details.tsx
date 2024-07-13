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
import { InsertPayment } from '@/db/schemas/payments';

export default function PaymentDetails() {
	const {
		control,
		register,
		watch,
		formState: { isSubmitting },
	} = useFormContext<InsertPayment>();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment Details</CardTitle>
				<CardDescription>
					Enter the amount paid for this payment.
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
				</div>
			</CardContent>
		</Card>
	);
}
