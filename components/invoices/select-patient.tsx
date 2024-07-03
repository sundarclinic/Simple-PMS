import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function SelectPatient() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Invoice for</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Label htmlFor='status'>Patient</Label>
						<Select>
							<SelectTrigger
								id='status'
								aria-label='Select status'
							>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='draft'>Draft</SelectItem>
								<SelectItem value='published'>
									Active
								</SelectItem>
								<SelectItem value='archived'>
									Archived
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
