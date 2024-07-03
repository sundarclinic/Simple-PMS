import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InvoiceDetails() {
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
					<div className='grid gap-3'>
						<Label htmlFor='amount'>Due</Label>
						<Input id='amount' type='number' className='w-full' />
					</div>
					<div className='grid gap-3'>
						<Label htmlFor='paidAmount'>Paid</Label>
						<Input
							id='paidAmount'
							type='number'
							className='w-full'
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
