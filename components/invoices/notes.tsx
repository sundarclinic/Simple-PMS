import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function InvoiceNotes() {
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
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.'
							className='min-h-32'
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
