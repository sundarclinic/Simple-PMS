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
				<CardTitle>Product Details</CardTitle>
				<CardDescription>
					Lipsum dolor sit amet, consectetur adipiscing elit
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							type='text'
							className='w-full'
							defaultValue='Gamer Gear Pro Controller'
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
